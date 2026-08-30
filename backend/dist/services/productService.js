import { Product } from "../models/product.js";
import { Image } from "../models/Image.js";
import { Category } from "../models/Category.js";
import { Color } from "../models/Color.js";
import { Plate } from "../models/plate.js";
import { ProductSet } from "../models/ProductSet.js";
import { ProductSetItem } from "../models/ProductSetItem.js";
import dataSource from "../utils/dbConfiguration.js";
import { In } from "typeorm";
import { OverallError } from "../errors/orderSaveError.js";
import imageService from "./imageService.js";
import inventoryService from "./inventoryService.js";
import { Inventory } from "../models/Inventory.js";
import { OrderInventory } from "../models/OrderInventory.js";
import plateService from "./plateService.js";
import productSetService from "./productSetService.js";
class ProductService {
    constructor() {
        this.productRepo = dataSource.getRepository(Product);
        this.orderInventoryRepo = dataSource.getRepository(OrderInventory);
    }
    async findProductsByFillter(filter) {
        const pageSize = 10;
        const pageNumber = filter.pageNumber || 1;
        const query = this.productRepo
            .createQueryBuilder("product")
            .leftJoinAndSelect("product.mainImage", "mainImage")
            .leftJoinAndSelect("product.inventories", "inventory")
            .skip((pageNumber - 1) * pageSize)
            .take(pageSize);
        if (filter.categoryId) {
            query.andWhere("product.mainCategoryId = :categoryId", {
                categoryId: filter.categoryId,
            });
        }
        if (filter.enableOff === "true") {
            console.log("here");
            query.andWhere("product.offPercent BETWEEN 1 AND 99");
        }
        if (filter.name) {
            query.andWhere("product.name LIKE :name", {
                name: `%${filter.name}%`,
            });
        }
        if (filter.minPrice && filter.maxPrice) {
            query.andWhere("inventory.price BETWEEN :minPrice AND :maxPrice", {
                minPrice: filter.minPrice,
                maxPrice: filter.maxPrice,
            });
        }
        return await query.getMany();
    }
    async findProductById(id) {
        return await this.productRepo.findOne({
            where: { id: id },
            relations: [
                "mainImage",
                "images",
                "mainCategory",
                "inventories",
                "color",
                "productSetItems",
                "productSetItems.plate",
                "productSetItems.productSet",
            ],
        });
    }
    async findProductByName(name) {
        return await this.productRepo.findOne({
            where: { name: name },
        });
    }
    async saveProduct(productSaveDto) {
        if (await this.findProductByName(productSaveDto.productName)) {
            throw new OverallError("محصول با این نام وجود دارد", 400);
        }
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
            });
            return inventory;
        });
        return dataSource.transaction(async (entityManager) => {
            await inventoryService.saveInventories(entityManager, inventories);
            let product;
            if (productSaveDto.type === "plate") {
                const plateDto = productSaveDto;
                const plate = new Plate();
                Object.assign(plate, {
                    width: plateDto.width,
                    weight: plateDto.weight,
                    height: plateDto.height,
                });
                product = plate;
            }
            else {
                const productSetDto = productSaveDto;
                const productSet = new ProductSet();
                const plates = await plateService.findProductByIds(productSetDto.items.map((item) => item.plateId));
                const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
                const setItems = productSetDto.items.map((item) => {
                    const plate = plateMap.get(item.plateId);
                    if (!plate) {
                        throw new OverallError(`بشقاب با شناسه ${item.plateId} یافت نشد`, 404);
                    }
                    const setItem = new ProductSetItem();
                    setItem.plate = plate;
                    setItem.quantity = item.quantity;
                    return setItem;
                });
                Object.assign(productSet, {
                    contain: productSetDto.contain,
                    productSetItems: setItems,
                    calculatedPrice: await productSetService.computeCalculatedPriceFromPlateItems(productSetDto.items),
                });
                if (productSetDto.manualPriceOverride != null) {
                    productSet.manualPriceOverride = productSetDto.manualPriceOverride;
                }
                product = productSet;
            }
            Object.assign(product, {
                material: productSaveDto.material,
                name: productSaveDto.productName,
                pattern: productSaveDto.pattern,
                code: productSaveDto.code,
                description: productSaveDto.description,
                offPercent: productSaveDto.offPercent,
                images,
                mainImage,
                inventories,
                type: productSaveDto.type,
                productName: productSaveDto.productName,
            });
            return await entityManager.save(Product, product);
        });
    }
    async deleteProduct(id) {
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
            throw new OverallError("امکان حذف وجود ندارد: این محصول در سفارش‌ها استفاده شده است", 400);
        }
        await this.productRepo.remove(product);
    }
    async updateProduct(id, updateDto) {
        const product = await this.findProductById(id);
        if (!product) {
            throw new OverallError("محصول مورد نظر یافت نشد", 404);
        }
        if (updateDto.productName && updateDto.productName !== product.name) {
            const existingProduct = await this.findProductByName(updateDto.productName);
            if (existingProduct) {
                throw new OverallError("محصول با این نام وجود دارد", 400);
            }
        }
        return dataSource.transaction(async (entityManager) => {
            const productRepo = entityManager.getRepository(Product);
            const inventoryRepo = entityManager.getRepository(Inventory);
            const imageRepo = entityManager.getRepository(Image);
            const categoryRepo = entityManager.getRepository(Category);
            const colorRepo = entityManager.getRepository(Color);
            if (updateDto.mainImageId) {
                const mainImage = await imageRepo.findOne({ where: { id: updateDto.mainImageId } });
                if (!mainImage) {
                    throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
                }
                product.mainImage = mainImage;
            }
            if (updateDto.imageIds && updateDto.imageIds.length > 0) {
                const images = await imageRepo.find({
                    where: { id: In(updateDto.imageIds) },
                });
                product.images = images;
            }
            if (updateDto.inventories && updateDto.inventories.length > 0) {
                if (product.inventories && product.inventories.length > 0) {
                    product.inventories.forEach((inv, index) => {
                        if (updateDto.inventories[index]) {
                            inv.price = updateDto.inventories[index].price;
                            inv.quantity = updateDto.inventories[index].quantity;
                        }
                    });
                    const extraInventories = updateDto.inventories.slice(product.inventories.length);
                    if (extraInventories.length > 0) {
                        const newInventories = extraInventories.map((inventoryDto) => {
                            const inventory = new Inventory();
                            inventory.price = inventoryDto.price;
                            inventory.quantity = inventoryDto.quantity;
                            inventory.product = product;
                            return inventory;
                        });
                        await inventoryRepo.save(newInventories);
                        product.inventories = [...product.inventories, ...newInventories];
                    }
                    await inventoryRepo.save(product.inventories);
                }
                else {
                    const newInventories = updateDto.inventories.map((inventoryDto) => {
                        const inventory = new Inventory();
                        inventory.price = inventoryDto.price;
                        inventory.quantity = inventoryDto.quantity;
                        inventory.product = product;
                        return inventory;
                    });
                    await inventoryRepo.save(newInventories);
                    product.inventories = newInventories;
                }
            }
            if (updateDto.code !== undefined)
                product.code = updateDto.code;
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
            if (updateDto.type !== undefined)
                product.type = updateDto.type;
            if (product instanceof Plate) {
                if (updateDto.height !== undefined)
                    product.height = updateDto.height;
                if (updateDto.weight !== undefined)
                    product.weight = updateDto.weight;
                if (updateDto.width !== undefined)
                    product.width = updateDto.width;
            }
            if (product instanceof ProductSet) {
                if (updateDto.contain !== undefined)
                    product.contain = updateDto.contain;
                if (updateDto.items && updateDto.items.length > 0) {
                    const plates = await plateService.findProductByIds(updateDto.items.map((item) => item.plateId));
                    const plateMap = new Map(plates.map((plate) => [plate.id, plate]));
                    const setItemRepo = entityManager.getRepository(ProductSetItem);
                    const existingItems = product.productSetItems || [];
                    if (existingItems.length > 0) {
                        await setItemRepo.remove(existingItems);
                    }
                    const setItems = updateDto.items.map((item) => {
                        const plate = plateMap.get(item.plateId);
                        if (!plate) {
                            throw new OverallError(`بشقاب با شناسه ${item.plateId} یافت نشد`, 404);
                        }
                        const setItem = new ProductSetItem();
                        setItem.productSet = product;
                        setItem.plate = plate;
                        setItem.quantity = item.quantity;
                        return setItem;
                    });
                    await setItemRepo.save(setItems);
                    product.productSetItems = setItems;
                    product.calculatedPrice = await productSetService.computeCalculatedPriceFromPlateItems(updateDto.items);
                }
                if (updateDto.manualPriceOverride !== undefined) {
                    product.manualPriceOverride = updateDto.manualPriceOverride;
                }
            }
            if (updateDto.categoryId) {
                const category = await categoryRepo.findOne({ where: { id: updateDto.categoryId } });
                if (category) {
                    product.mainCategory = category;
                }
            }
            if (updateDto.colorId) {
                const color = await colorRepo.findOne({ where: { id: updateDto.colorId } });
                if (color) {
                    product.color = color;
                }
            }
            return await productRepo.save(product);
        });
    }
}
export default new ProductService();
