import { instanceToPlain } from "class-transformer";
import { OverallError } from "../errors/orderSaveError.js";
import { ShoppingCartItem, CartItemType } from "../models/ShoppingCartItem.js";
import { User } from "../models/User.js";
import dataSource from "../utils/dbConfiguration.js";
import inventoryService from "./inventoryService.js";
import productSetService from "./productSetService.js";

interface SyncSetEntry {
  productSetId: number;
  colorId: number;
  count: number;
}

class ShoppingCartService {
  private shoppingCartRepo = dataSource.getRepository(ShoppingCartItem);
  async findShoppingCartItemByUserIdAndInventoryId(
    inventoryId: number,
    userId: number
  ) {
    return await this.shoppingCartRepo.findOne({
      where: {
        user: {
          id: userId,
        },
        inventory: {
          id: inventoryId,
        },
      },
    });
  }
  async getUserShoppingCartItems(userId: number): Promise<ShoppingCartItem[]> {
    return await this.shoppingCartRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }
  private getDbItemKey(item: ShoppingCartItem): string | null {
    if (item.itemType === CartItemType.SET) {
      if (!item.productSet) {
        return null;
      }
      return `set:${item.productSet.id}:${item.color?.id}`;
    }
    if (!item.inventory) {
      return null;
    }
    return `inv:${item.inventory.id}`;
  }
  async getUserCart(userId: number) {
    const items = await this.shoppingCartRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: [
        "inventory",
        "inventory.product",
        "inventory.product.mainImage",
        "productSet",
        "productSet.mainImage",
        "color",
      ],
      order: {
        dateCreated: "ASC",
      },
    });

    const result: any[] = [];
    for (const item of items) {
      if (item.itemType === CartItemType.SET) {
        if (!item.productSet) {
          continue;
        }
        let setComponents: any[] = [];
        let price = 0;
        let availableQuantity = 0;
        let isManual = false;
        let calculatedPrice = 0;
        try {
          setComponents = await productSetService.resolveSetInventoriesForColor(
            item.productSet.id,
            item.color?.id
          );
          const priceInfo = await productSetService.getFinalSetPrice(
            item.productSet.id,
            item.color?.id
          );
          price = priceInfo.price;
          isManual = priceInfo.isManual;
          calculatedPrice = priceInfo.calculatedPrice;
          availableQuantity = await productSetService.getAvailableSetQuantity(
            item.productSet.id,
            item.color?.id
          );
        } catch (error) {
          setComponents = [];
        }
        result.push({
          itemType: "SET",
          product: item.productSet,
          inventory: null,
          color: item.color,
          quantity: item.count,
          price,
          availableQuantity,
          setPriceIsManual: isManual,
          setCalculatedPrice: calculatedPrice,
          setComponents,
        });
      } else {
        result.push({
          itemType: "SIMPLE",
          product: item.inventory?.product,
          inventory: item.inventory,
          color: null,
          quantity: item.count,
          price: item.inventory?.price,
          availableQuantity: item.inventory?.quantity,
          setComponents: null,
        });
      }
    }
    return instanceToPlain(result);
  }
  async addItemToUserShopingCart(
    inventoryId: number | null,
    count: number,
    user: User,
    options?: {
      itemType?: CartItemType;
      productSetId?: number;
      colorId?: number;
    }
  ) {
    const itemType = options?.itemType ?? CartItemType.SIMPLE;
    if (itemType === CartItemType.SET) {
      const productSetId = Number(options?.productSetId);
      const colorId = Number(options?.colorId);
      if (!Number.isInteger(productSetId) || !Number.isInteger(colorId)) {
        throw new OverallError("اطلاعات سرویس یا رنگ انتخابی ناقص است", 400);
      }
      const productSet = await productSetService.findProductSetById(
        productSetId
      );
      if (!productSet) {
        throw new OverallError("سرویس مورد نظر یافت نشد", 404);
      }
      const { colors, hasNoCommonColor } =
        await productSetService.getAvailableColorsForSet(productSetId);
      if (hasNoCommonColor || colors.length === 0) {
        throw new OverallError(
          "این سرویس رنگ مشترکی بین قطعاتش ندارد و قابل سفارش نیست",
          400
        );
      }
      const colorOption = colors.find((c) => c.colorId === colorId);
      if (!colorOption) {
        throw new OverallError(
          "رنگ انتخابی جزو رنگ‌های معتبر این سرویس نیست",
          400
        );
      }
      if (count > colorOption.availableQuantity) {
        throw new OverallError("تعداد انتخابی بیشتر از موجودی سرویس است", 400);
      }
      const existingItem = await this.shoppingCartRepo.findOne({
        where: {
          user: {
            id: user.id,
          },
          productSet: { id: productSetId },
          color: { id: colorId },
        },
      });
      if (existingItem) {
        if (count === 0) {
          return await this.shoppingCartRepo.remove(existingItem);
        }
        existingItem.count = count;
        return await this.shoppingCartRepo.save(existingItem);
      }
      if (count === 0) {
        throw new OverallError("سرویس در سبد وجود ندارد", 400);
      }
      const newShoppingCartItem = new ShoppingCartItem();
      newShoppingCartItem.count = count;
      newShoppingCartItem.user = user;
      newShoppingCartItem.itemType = CartItemType.SET;
      newShoppingCartItem.productSet = {
        id: productSetId,
      } as any;
      newShoppingCartItem.color = { id: colorId } as any;
      newShoppingCartItem.inventory = null;
      return await this.shoppingCartRepo.save(newShoppingCartItem);
    }

    const inventory = await inventoryService.findInventoryById(inventoryId!);
    if (!inventory) {
      throw new OverallError("محصول انتخابی وجود ندارد");
    }
    if (inventory.quantity < count) {
      throw new OverallError("تعداد انتخابی درست نیست");
    }
    const existingShoppingCartItem = await this.shoppingCartRepo.findOne({
      where: {
        user: {
          id: user.id,
        },
        inventory: { id: inventoryId! },
      },
    });

    if (existingShoppingCartItem) {
      if (count === 0) {
        return await this.shoppingCartRepo.remove(existingShoppingCartItem);
      } else {
        existingShoppingCartItem.count = count;
        return await this.shoppingCartRepo.save(existingShoppingCartItem);
      }
    } else {
      if (count === 0) {
        throw new OverallError("کالا در سبد وجود ندارد");
      }
      const newShoppingCartItem = new ShoppingCartItem();
      newShoppingCartItem.count = count;
      newShoppingCartItem.user = user;
      newShoppingCartItem.itemType = CartItemType.SIMPLE;
      newShoppingCartItem.inventory = inventory;
      return await this.shoppingCartRepo.save(newShoppingCartItem);
    }
  }
  async syncShoppingCart(
    user: User,
    items: any[],
    replace: boolean = false
  ) {
    const desiredSimple = new Map<number, number>();
    const desiredSets = new Map<string, SyncSetEntry>();
    const desiredKeys = new Set<string>();

    (items ?? []).forEach((raw: any) => {
      const isSet = raw?.itemType === "SET";
      const count = Number(raw?.count);
      if (!Number.isFinite(count) || count < 0) {
        return;
      }
      if (isSet) {
        const productSetId = Number(raw?.productSetId);
        const colorId = Number(raw?.colorId);
        if (!Number.isInteger(productSetId) || !Number.isInteger(colorId)) {
          return;
        }
        const key = `set:${productSetId}:${colorId}`;
        desiredKeys.add(key);
        const existing = desiredSets.get(key);
        desiredSets.set(key, {
          productSetId,
          colorId,
          count: existing ? Math.max(existing.count, count) : count,
        });
      } else {
        const inventoryId = Number(raw?.inventoryId);
        if (!Number.isInteger(inventoryId)) {
          return;
        }
        const key = `inv:${inventoryId}`;
        desiredKeys.add(key);
        const existingCount = desiredSimple.get(inventoryId);
        desiredSimple.set(
          inventoryId,
          existingCount !== undefined
            ? Math.max(existingCount, count)
            : count
        );
      }
    });

    for (const [key, entry] of Array.from(desiredSets.entries())) {
      try {
        const { colors, hasNoCommonColor } =
          await productSetService.getAvailableColorsForSet(entry.productSetId);
        if (hasNoCommonColor || colors.length === 0) {
          desiredSets.delete(key);
          desiredKeys.delete(key);
          continue;
        }
        const colorOption = colors.find((c) => c.colorId === entry.colorId);
        if (!colorOption) {
          desiredSets.delete(key);
          desiredKeys.delete(key);
          continue;
        }
        entry.count = Math.min(entry.count, colorOption.availableQuantity);
      } catch (error) {
        desiredSets.delete(key);
        desiredKeys.delete(key);
      }
    }

    const inventoryIds = Array.from(desiredSimple.keys());
    const inventories =
      inventoryIds.length > 0
        ? await inventoryService.findInventoryByIds(
            dataSource.manager,
            inventoryIds
          )
        : [];
    const inventoryMap = new Map(inventories.map((inv) => [inv.id, inv]));

    const dbItems = await this.shoppingCartRepo.find({
      where: {
        user: {
          id: user.id,
        },
      },
      relations: ["inventory", "productSet", "color"],
    });
    const dbItemMap = new Map<string, ShoppingCartItem>();
    for (const dbItem of dbItems) {
      const key = this.getDbItemKey(dbItem);
      if (key) {
        dbItemMap.set(key, dbItem);
      }
    }

    for (const inventoryId of inventoryIds) {
      const requestedCount = desiredSimple.get(inventoryId)!;
      const inventory = inventoryMap.get(inventoryId);
      if (!inventory) {
        continue;
      }
      const clampedCount = Math.min(requestedCount, inventory.quantity);
      const key = `inv:${inventoryId}`;
      const existingItem = dbItemMap.get(key);
      if (existingItem) {
        const nextCount = replace
          ? clampedCount
          : Math.max(existingItem.count, clampedCount);
        if (nextCount <= 0) {
          await this.shoppingCartRepo.remove(existingItem);
          dbItemMap.delete(key);
        } else if (nextCount !== existingItem.count) {
          existingItem.count = nextCount;
          await this.shoppingCartRepo.save(existingItem);
        }
      } else if (clampedCount > 0) {
        const newShoppingCartItem = new ShoppingCartItem();
        newShoppingCartItem.count = clampedCount;
        newShoppingCartItem.user = user;
        newShoppingCartItem.itemType = CartItemType.SIMPLE;
        newShoppingCartItem.inventory = inventory;
        await this.shoppingCartRepo.save(newShoppingCartItem);
        dbItemMap.set(key, newShoppingCartItem);
      }
    }

    for (const [key, entry] of desiredSets.entries()) {
      const existingItem = dbItemMap.get(key);
      if (existingItem) {
        const nextCount = replace
          ? entry.count
          : Math.max(existingItem.count, entry.count);
        if (nextCount <= 0) {
          await this.shoppingCartRepo.remove(existingItem);
          dbItemMap.delete(key);
        } else if (nextCount !== existingItem.count) {
          existingItem.count = nextCount;
          await this.shoppingCartRepo.save(existingItem);
        }
      } else if (entry.count > 0) {
        const newShoppingCartItem = new ShoppingCartItem();
        newShoppingCartItem.count = entry.count;
        newShoppingCartItem.user = user;
        newShoppingCartItem.itemType = CartItemType.SET;
        newShoppingCartItem.productSet = {
          id: entry.productSetId,
        } as any;
        newShoppingCartItem.color = { id: entry.colorId } as any;
        newShoppingCartItem.inventory = null;
        await this.shoppingCartRepo.save(newShoppingCartItem);
        dbItemMap.set(key, newShoppingCartItem);
      }
    }

    if (replace) {
      for (const [key, dbItem] of dbItemMap.entries()) {
        if (!desiredKeys.has(key)) {
          await this.shoppingCartRepo.remove(dbItem);
          dbItemMap.delete(key);
        }
      }
    }

    return await this.getUserCart(user.id);
  }
}
export default new ShoppingCartService();
