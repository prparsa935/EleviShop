import { Product } from "../models/product.js";
import { Image } from "../models/Image.js";
import { Category } from "../models/Category.js";
import { Color } from "../models/Color.js";
import { Plate } from "../models/plate.js";
import { ProductSet } from "../models/ProductSet.js";
import { ProductSetItem } from "../models/ProductSetItem.js";
import { Mold } from "../models/Mold.js";
import { MoldSize } from "../models/MoldSize.js";
import { MoldPattern } from "../models/MoldPattern.js";
import { Pattern } from "../models/Pattern.js";
import dataSource from "../utils/dbConfiguration.js";
import { EntityManager, In, Not } from "typeorm";
import { ProductFilter } from "../types/productTypes.js";
import { OverallError } from "../errors/orderSaveError.js";
import imageService from "./imageService.js";
import inventoryService from "./inventoryService.js";
import {
  PlateSaveDto,
  ProductSetSaveDto,
  UpdateProductDto,
} from "../dtos/product.dto.js";
import { Inventory } from "../models/Inventory.js";
import { OrderInventory } from "../models/OrderInventory.js";
import plateService from "./plateService.js";
import productSetService from "./productSetService.js";

export interface MoldPatternCard {
  cardType: "pattern" | "productSet";
  id: number;
  productId?: number;
  name: string;
  shape: string | null;
  patternName: string | null;
  mainImage: { filePath: string } | null;
  inventories: { id: number; price: number; quantity: number }[];
  offPercent: number;
  rate: number;
  rateCount: number;
  commentCount: number;
  buyerCount: number;
  totalQuantity: number;
}

class ProductService {
  private productRepo = dataSource.getRepository(Product);
  private orderInventoryRepo = dataSource.getRepository(OrderInventory);
  private moldRepo = dataSource.getRepository(Mold);
  private moldSizeRepo = dataSource.getRepository(MoldSize);
  private moldPatternRepo = dataSource.getRepository(MoldPattern);
  private patternRepo = dataSource.getRepository(Pattern);

  async findProductsByFillter(
    filter: ProductFilter
  ): Promise<MoldPatternCard[]> {
    const pageSize = 10;
    const pageNumber = filter.pageNumber || 1;

    const query = this.productRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.mainImage", "mainImage")
      .leftJoinAndSelect("product.inventories", "inventory")
      .leftJoinAndSelect("product.moldPattern", "moldPattern")
      .leftJoinAndSelect("moldPattern.mold", "mold")
      .leftJoinAndSelect("moldPattern.pattern", "pattern")
      .where("product.type IN (:...types)", {
        types: ["plate", "productSet"],
      });

    if (filter.categoryId) {
      // selecting a parent category must also match products of its whole
      // subtree, not only products directly assigned to that exact category
      const categoryIds = await this.collectCategoryAndDescendantIds(
        filter.categoryId
      );
      query.andWhere("product.mainCategoryId IN (:...categoryIds)", {
        categoryIds: categoryIds.length > 0 ? categoryIds : [filter.categoryId],
      });
    }

    if (filter.enableOff === "true") {
      query.andWhere("product.offPercent BETWEEN 1 AND 99");
    }

    if (filter.name) {
      query.andWhere("product.name LIKE :name", {
        name: `%${filter.name}%`,
      });
    }

    const products = await query.getMany();

    // flat plate-only listing (real product ids) for admin pickers such as the
    // set member selector — picking a pattern/_set id there used to fail with
    // "بشقاب با شناسه ... یافت نشد"
    if (filter.type === "plate") {
      return products
        .filter((product) => product.type === "plate")
        .map((product) => ({
          cardType: "productSet" as const,
          id: product.id,
          productId: product.id,
          name: product.name,
          shape: product.moldPattern?.mold?.name ?? null,
          patternName: product.moldPattern?.pattern?.name ?? product.pattern ?? null,
          mainImage: product.mainImage
            ? { filePath: product.mainImage.filePath }
            : null,
          inventories: (product.inventories ?? [])
            .map((inv) => ({ id: inv.id, price: inv.price, quantity: inv.quantity }))
            .sort((a, b) => a.price - b.price),
          offPercent: product.offPercent ?? 0,
          rate: product.rate ?? 0,
          rateCount: product.rateCount ?? 0,
          commentCount: product.commentCount ?? 0,
          buyerCount: product.buyerCount ?? 0,
          totalQuantity: (product.inventories ?? []).reduce(
            (sum, inv) => sum + (inv.quantity ?? 0),
            0
          ),
        }));
    }

    let filtered = products;
    if (filter.minPrice && filter.maxPrice) {
      filtered = filtered.filter((product) =>
        (product.inventories ?? []).some(
          (inv) =>
            inv.price >= filter.minPrice! && inv.price <= filter.maxPrice!
        )
      );
    }

    const patternGroups = new Map<number, Product[]>();
    const standaloneProducts: Product[] = [];
    for (const product of filtered) {
      if (product.type === "productSet") {
        standaloneProducts.push(product);
      } else if (product.moldPatternId != null) {
        if (!patternGroups.has(product.moldPatternId)) {
          patternGroups.set(product.moldPatternId, []);
        }
        patternGroups.get(product.moldPatternId)!.push(product);
      } else {
        standaloneProducts.push(product);
      }
    }

    const cards: MoldPatternCard[] = [];
    for (const [moldPatternId, group] of patternGroups) {
      cards.push(this.buildPatternCard(moldPatternId, group));
    }
    for (const product of standaloneProducts) {
      cards.push({
        cardType: "productSet",
        id: product.id,
        productId: product.id,
        name: product.name,
        shape: null,
        patternName: product.pattern ?? null,
        mainImage: product.mainImage
          ? { filePath: product.mainImage.filePath }
          : null,
        inventories: (product.inventories ?? [])
          .map((inv) => ({ id: inv.id, price: inv.price, quantity: inv.quantity }))
          .sort((a, b) => a.price - b.price),
        offPercent: product.offPercent ?? 0,
        rate: product.rate ?? 0,
        rateCount: product.rateCount ?? 0,
        commentCount: product.commentCount ?? 0,
        buyerCount: product.buyerCount ?? 0,
        totalQuantity: (product.inventories ?? []).reduce(
          (sum, inv) => sum + (inv.quantity ?? 0),
          0
        ),
      });
    }

    return cards.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  private async collectCategoryAndDescendantIds(
    categoryId: number
  ): Promise<number[]> {
    const categoryRepo = dataSource.getRepository(Category);
    const ids: number[] = [];
    const walk = async (id: number) => {
      const category = await categoryRepo.findOne({
        where: { id },
        relations: ["childCategories"],
      });
      if (!category || ids.includes(category.id)) {
        return;
      }
      ids.push(category.id);
      for (const child of category.childCategories ?? []) {
        await walk(child.id);
      }
    };
    await walk(categoryId);
    return ids;
  }

  private buildPatternCard(
    moldPatternId: number,
    group: Product[]
  ): MoldPatternCard {
    const moldPattern = group[0].moldPattern;
    const allInventories = group.flatMap(
      (product) => product.inventories ?? []
    );
    const inStock = allInventories.filter((inv) => (inv.quantity ?? 0) > 0);
    const pricePool =
      inStock.length > 0
        ? inStock
            .map((inv) => ({ id: inv.id, price: inv.price, quantity: inv.quantity }))
            .sort((a, b) => a.price - b.price)
        : allInventories
            .map((inv) => ({ id: inv.id, price: inv.price, quantity: inv.quantity }))
            .sort((a, b) => a.price - b.price);
    const withImage = group.find((product) => product.mainImage) ?? group[0];
    const patternName = moldPattern?.pattern?.name ?? null;
    const moldName = moldPattern?.mold?.name ?? group[0].name;
    return {
      cardType: "pattern",
      id: moldPatternId,
      productId: withImage.id,
      name: patternName ? `${moldName} ${patternName}` : moldName,
      shape: moldPattern?.mold?.shape ?? null,
      patternName,
      mainImage: withImage.mainImage
        ? { filePath: withImage.mainImage.filePath }
        : null,
      inventories: pricePool,
      offPercent: Math.max(...group.map((product) => product.offPercent ?? 0)),
      rate: Math.max(...group.map((product) => product.rate ?? 0)),
      rateCount: group.reduce(
        (sum, product) => sum + (product.rateCount ?? 0),
        0
      ),
      commentCount: group.reduce(
        (sum, product) => sum + (product.commentCount ?? 0),
        0
      ),
      buyerCount: group.reduce(
        (sum, product) => sum + (product.buyerCount ?? 0),
        0
      ),
      totalQuantity: inStock.reduce(
        (sum, inv) => sum + (inv.quantity ?? 0),
        0
      ),
    };
  }

  async findMoldPatternDetail(moldPatternId: number) {
    const moldPattern = await this.moldPatternRepo.findOne({
      where: { id: moldPatternId },
      relations: ["mold", "pattern"],
    });
    if (!moldPattern) {
      throw new OverallError("طرح مورد نظر یافت نشد", 404);
    }
    const products = await this.productRepo.find({
      where: { moldPatternId },
      relations: [
        "mainImage",
        "images",
        "mainCategory",
        "inventories",
        "inventories.color",
        "inventories.size",
      ],
    });
    if (products.length === 0) {
      throw new OverallError("محصولی برای این طرح یافت نشد", 404);
    }
    const sizeMap = new Map<
      number,
      {
        sizeId: number;
        sizeLabel: string;
        height: number | null;
        width: number | null;
        weight: number | null;
        productIds: number[];
        inventories: {
          id: number;
          price: number;
          quantity: number;
          colorId: number | null;
          colorName: string | null;
          colorHex: string | null;
        }[];
      }
    >();
    for (const product of products) {
      for (const inv of product.inventories ?? []) {
        const size = inv.size;
        const sizeId = size?.id ?? 0;
        if (!sizeMap.has(sizeId)) {
          sizeMap.set(sizeId, {
            sizeId,
            sizeLabel: size?.sizeLabel ?? "استاندارد",
            height: size?.height ?? null,
            width: size?.width ?? null,
            weight: size?.weight ?? null,
            productIds: [],
            inventories: [],
          });
        }
        const sizeEntry = sizeMap.get(sizeId)!;
        if (!sizeEntry.productIds.includes(product.id)) {
          sizeEntry.productIds.push(product.id);
        }
        sizeEntry.inventories.push({
          id: inv.id,
          price: inv.price,
          quantity: inv.quantity,
          colorId: inv.colorId,
          colorName: inv.color?.name ?? null,
          colorHex: inv.color?.hexCode ?? null,
        });
      }
    }
    const withImage = products.find((product) => product.mainImage) ?? products[0];
    return {
      kind: "pattern" as const,
      id: moldPattern.id,
      name: moldPattern.pattern
        ? `${moldPattern.mold.name} ${moldPattern.pattern.name}`
        : moldPattern.mold.name,
      description: withImage.description,
      material: withImage.material,
      code: withImage.code,
      offPercent: Math.max(...products.map((p) => p.offPercent ?? 0)),
      rate: Math.max(...products.map((p) => p.rate ?? 0)),
      rateScore: Math.max(...products.map((p) => p.rateScore ?? 0)),
      rateCount: products.reduce((sum, p) => sum + (p.rateCount ?? 0), 0),
      commentCount: products.reduce((sum, p) => sum + (p.commentCount ?? 0), 0),
      buyerCount: products.reduce((sum, p) => sum + (p.buyerCount ?? 0), 0),
      mainImage: withImage.mainImage,
      images: products.flatMap((p) => p.images ?? []),
      mainCategory: withImage.mainCategory,
      representativeProductId: withImage.id,
      mold: moldPattern.mold,
      pattern: moldPattern.pattern,
      sizes: [...sizeMap.values()],
    };
  }

  async findProductById(id: number): Promise<Product> {
    return await this.productRepo.findOne({
      where: { id: id },
      relations: [
        "mainImage",
        "images",
        "mainCategory",
        "inventories",
        "inventories.color",
        "moldPattern",
        "moldPattern.mold",
        "moldPattern.pattern",
        "inventories.size",
        "productSetItems",
        "productSetItems.plate",
        "productSetItems.productSet",
        "plateSetItems",
        "plateSetItems.productSet",
        "plateSetItems.productSet.mainImage",
        "plateSetItems.productSet.inventories",
      ],
    });
  }

  async findProductByName(name: string): Promise<Product> {
    return await this.productRepo.findOne({
      where: { name: name },
    });
  }

  async findRelatedProducts(id: number, code: string): Promise<Product[]> {
    const current = await this.productRepo.findOne({
      where: { id },
      relations: ["mainCategory"],
    });
    if (!current) {
      return [];
    }
    // products of the same kind in the same category first (codes are unique
    // per product now, so the legacy same-code match usually returns nothing)
    if (current.mainCategory?.id) {
      const related = await this.productRepo.find({
        where: {
          id: Not(id),
          type: current.type,
          mainCategory: { id: current.mainCategory.id },
        },
        relations: ["mainImage", "inventories"],
        take: 10,
      });
      if (related.length > 0) {
        return related;
      }
    }
    if (!code) {
      return [];
    }
    return await this.productRepo.find({
      where: { code: code, id: Not(id) },
      relations: ["mainImage", "inventories"],
      take: 10,
    });
  }

  async saveProduct(
    productSaveDto: PlateSaveDto | ProductSetSaveDto
  ): Promise<Product> {
    if (await this.findProductByName(productSaveDto.productName)) {
      throw new OverallError("محصول با این نام وجود دارد", 400);
    }

    let resolvedPattern = productSaveDto.pattern ?? "";

    const [mainImage, images] = await Promise.all([
      imageService.findImageById(productSaveDto.mainImageId),
      imageService.findImageByIds(productSaveDto.imageIds),
    ]);

    if (!mainImage) {
      throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
    }

    const inventories = productSaveDto.inventories.map((inventoryDto) => {
      const inventory = new Inventory();
      Object.assign(inventory, {
        price: inventoryDto.price,
        quantity: inventoryDto.quantity,
        colorId: inventoryDto.colorId ?? null,
        sizeId: inventoryDto.sizeId ?? null,
      });
      return inventory;
    });

    return dataSource.transaction(async (entityManager) => {
      await inventoryService.saveInventories(entityManager, inventories);

      if (!productSaveDto.categoryId) {
        throw new OverallError("لطفا دسته‌بندی را انتخاب کنید", 400);
      }
      const category = await entityManager
        .getRepository(Category)
        .findOne({ where: { id: productSaveDto.categoryId } });
      if (!category) {
        throw new OverallError("دسته‌بندی یافت نشد", 404);
      }

      let product: Product;
      if (productSaveDto.type === "plate") {
        const plateDto = productSaveDto as PlateSaveDto;
        const moldPattern = await this.moldPatternRepo.findOne({
          where: { id: plateDto.moldPatternId },
          relations: ["pattern"],
        });
        if (!moldPattern) {
          throw new OverallError("ترکیب قالب و طرح یافت نشد", 404);
        }
        const plate = new Plate();
        plate.moldPattern = moldPattern;
        resolvedPattern = moldPattern.pattern?.name ?? resolvedPattern;
        product = plate;
      } else {
        const productSetDto = productSaveDto as ProductSetSaveDto;
        const productSet = new ProductSet();
        const plates = await plateService.findProductByIds(
          productSetDto.items.map((item) => item.plateId)
        );
        const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
        const setItems = productSetDto.items.map((item) => {
          const plate = plateMap.get(item.plateId);
          if (!plate) {
            throw new OverallError(
              `بشقاب با شناسه ${item.plateId} یافت نشد`,
              404
            );
          }
          const setItem = new ProductSetItem();
          setItem.plate = plate;
          setItem.quantity = item.quantity;
          return setItem;
        });
        Object.assign(productSet, {
          contain: productSetDto.contain,
          productSetItems: setItems,
          calculatedPrice: await productSetService.computeCalculatedPriceFromPlateItems(
            productSetDto.items
          ),
        });
        if (productSetDto.manualPriceOverride != null) {
          productSet.manualPriceOverride = productSetDto.manualPriceOverride;
        }
        product = productSet;
      }

      Object.assign(product, {
        material: productSaveDto.material,
        name: productSaveDto.productName,
        pattern: resolvedPattern,
        mainCategory: category,
        code: productSaveDto.code,
        description: productSaveDto.description,
        offPercent: productSaveDto.offPercent,
        images: await this.ownOrCopyGalleryImages(entityManager, images, null),
        mainImage,
        inventories,
        type: productSaveDto.type,
      });

      return await entityManager.save(Product, product);
    });
  }

  /**
   * Gallery images are owned by exactly one product (image.productId). When a
   * save reuses an image that already belongs to another product, duplicate
   * the image row (same file) instead of stealing it from the other product —
   * otherwise the previous product silently loses the image from its gallery.
   */
  private async ownOrCopyGalleryImages(
    entityManager: EntityManager,
    images: Image[],
    targetProductId: number | null
  ): Promise<Image[]> {
    const imageRepo = entityManager.getRepository(Image);
    const resolved: Image[] = [];
    for (const image of images) {
      let ownerId: number | null = null;
      if (image.id != null) {
        const rows: { productId: number | null }[] = await entityManager.query(
          'SELECT "productId" FROM image WHERE id = $1',
          [image.id]
        );
        ownerId = rows?.[0]?.productId ?? null;
      }
      if (
        ownerId == null ||
        (targetProductId != null && ownerId === targetProductId)
      ) {
        resolved.push(image);
        continue;
      }
      const copy = new Image();
      copy.filePath = image.filePath;
      resolved.push(await imageRepo.save(copy));
    }
    return resolved;
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new OverallError("محصول مورد نظر یافت نشد", 404);
    }

    const orderInventories = await this.orderInventoryRepo
      .createQueryBuilder("oi")
      .innerJoin("oi.inventory", "inv")
      .where("inv.productId = :productId", { productId: id })
      .getCount();

    if (orderInventories > 0) {
      throw new OverallError(
        "امکان حذف وجود ندارد: این محصول در سفارش‌ها استفاده شده است",
        400
      );
    }

    await dataSource.transaction(async (entityManager) => {
      // detach gallery images instead of leaving rows referencing the product:
      // the FK would block the delete and other products may still use the
      // same file as their main image
      await entityManager
        .getRepository(Image)
        .createQueryBuilder()
        .update(Image)
        .set({ product: null })
        .where("productId = :id", { id })
        .execute();
      await entityManager.remove(product);
    });
  }

  async updateProduct(
    id: number,
    updateDto: UpdateProductDto
  ): Promise<Product> {
    const product = await this.findProductById(id);
    if (!product) {
      throw new OverallError("محصول مورد نظر یافت نشد", 404);
    }

    if (updateDto.productName && updateDto.productName !== product.name) {
      const existingProduct = await this.findProductByName(
        updateDto.productName
      );
      if (existingProduct) {
        throw new OverallError("محصول با این نام وجود دارد", 400);
      }
    }

    return dataSource.transaction(async (entityManager) => {
      const productRepo = entityManager.getRepository(Product);
      const inventoryRepo = entityManager.getRepository(Inventory);
      const imageRepo = entityManager.getRepository(Image);
      const categoryRepo = entityManager.getRepository(Category);

      if (updateDto.mainImageId) {
        const mainImage = await imageRepo.findOne({
          where: { id: updateDto.mainImageId },
        });
        if (!mainImage) {
          throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
        }
        product.mainImage = mainImage;
      }

      if (updateDto.imageIds && updateDto.imageIds.length > 0) {
        const images = await imageRepo.find({
          where: { id: In(updateDto.imageIds) },
        });
        product.images = await this.ownOrCopyGalleryImages(
          entityManager,
          images,
          product.id
        );
      }

      if (updateDto.inventories && updateDto.inventories.length > 0) {
        const existingInventories = product.inventories || [];
        const byId = new Map(existingInventories.map((inv) => [inv.id, inv]));
        const keptIds: number[] = [];
        const newInventories: Inventory[] = [];
        for (const inventoryDto of updateDto.inventories) {
          const target = inventoryDto.id ? byId.get(inventoryDto.id) : undefined;
          if (target) {
            target.price = inventoryDto.price;
            target.quantity = inventoryDto.quantity;
            // رابطه‌های لودشده باید همگام با اسکالرها به‌روز شوند وگرنه در
            // save مقدار قبلی رابطه روی ستون FK غلبه می‌کند
            target.colorId = inventoryDto.colorId ?? null;
            target.color = inventoryDto.colorId
              ? ({ id: inventoryDto.colorId } as Color)
              : null;
            target.sizeId = inventoryDto.sizeId ?? null;
            target.size = inventoryDto.sizeId
              ? ({ id: inventoryDto.sizeId } as MoldSize)
              : null;
            keptIds.push(target.id);
          } else {
            const inventory = new Inventory();
            inventory.price = inventoryDto.price;
            inventory.quantity = inventoryDto.quantity;
            inventory.colorId = inventoryDto.colorId ?? null;
            inventory.sizeId = inventoryDto.sizeId ?? null;
            // استاب فقط-id به‌جای entity کامل تا serialize پاسخ حلقه ارجاع نسازد
            inventory.product = { id: product.id } as Product;
            newInventories.push(inventory);
          }
        }
        const removed = existingInventories.filter(
          (inv) => !keptIds.includes(inv.id)
        );
        if (removed.length > 0) {
          const usedInOrders = await this.orderInventoryRepo
            .createQueryBuilder("oi")
            .where("oi.inventoryId IN (:...ids)", {
              ids: removed.map((r) => r.id),
            })
            .getCount();
          if (usedInOrders > 0) {
            throw new OverallError(
              "امکان حذف وجود ندارد: برخی ردیف‌های موجودی در سفارش استفاده شده‌اند",
              400
            );
          }
          await inventoryRepo.remove(removed);
        }
        const kept = existingInventories.filter((inv) =>
          keptIds.includes(inv.id)
        );
        if (kept.length > 0) {
          await inventoryRepo.save(kept);
        }
        if (newInventories.length > 0) {
          await inventoryRepo.save(newInventories);
        }
        product.inventories = [...kept, ...newInventories];
      }

      if (updateDto.code !== undefined) product.code = updateDto.code;
      if (updateDto.productName !== undefined)
        product.name = updateDto.productName;
      if (updateDto.description !== undefined)
        product.description = updateDto.description;
      if (updateDto.offPercent !== undefined)
        product.offPercent = updateDto.offPercent;
      if (updateDto.material !== undefined)
        product.material = updateDto.material;
      if (updateDto.pattern !== undefined)
        product.pattern = updateDto.pattern;
      if (updateDto.type !== undefined) product.type = updateDto.type;

      if (updateDto.moldPatternId !== undefined)
        product.moldPatternId = updateDto.moldPatternId;

      if (product instanceof ProductSet) {
        if (updateDto.contain !== undefined) product.contain = updateDto.contain;
        if (updateDto.items && updateDto.items.length > 0) {
          const plates = await plateService.findProductByIds(
            updateDto.items.map((item) => item.plateId)
          );
          const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
          const setItemRepo = entityManager.getRepository(ProductSetItem);
          const existingItems = product.productSetItems || [];
          if (existingItems.length > 0) {
            await setItemRepo.remove(existingItems);
          }
          const setItems = updateDto.items.map((item) => {
            const plate = plateMap.get(item.plateId);
            if (!plate) {
              throw new OverallError(
                `بشقاب با شناسه ${item.plateId} یافت نشد`,
                404
              );
            }
            const setItem = new ProductSetItem();
            setItem.productSet = product;
            setItem.plate = plate;
            setItem.quantity = item.quantity;
            return setItem;
          });
          await setItemRepo.save(setItems);
          product.productSetItems = setItems;
          product.calculatedPrice =
            await productSetService.computeCalculatedPriceFromPlateItems(
              updateDto.items
            );
        }
        if (updateDto.manualPriceOverride !== undefined) {
          product.manualPriceOverride = updateDto.manualPriceOverride;
        }
      }

      if (updateDto.categoryId) {
        const category = await categoryRepo.findOne({
          where: { id: updateDto.categoryId },
        });
        if (category) {
          product.mainCategory = category;
        }
      }

      return await productRepo.save(product);
    });
  }
}
export default new ProductService();
