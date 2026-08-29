import { instanceToPlain } from "class-transformer";
import { OverallError } from "../errors/orderSaveError.js";
import { ShoppingCartItem } from "../models/ShoppingCartItem.js";
import dataSource from "../utils/dbConfiguration.js";
import inventoryService from "./inventoryService.js";
class ShoppingCartService {
    constructor() {
        this.shoppingCartRepo = dataSource.getRepository(ShoppingCartItem);
    }
    async findShoppingCartItemByUserIdAndInventoryId(inventoryId, userId) {
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
    async getUserShoppingCartItems(userId) {
        return await this.shoppingCartRepo.find({
            where: {
                user: {
                    id: userId,
                },
            },
        });
    }
    async getUserCart(userId) {
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
            ],
            order: {
                dateCreated: "ASC",
            },
        });
        return instanceToPlain(items.map((item) => ({
            product: item.inventory?.product,
            inventory: item.inventory,
            quantity: item.count,
        })));
    }
    async addItemToUserShopingCart(inventoryId, count, user) {
        const inventory = await inventoryService.findInventoryById(inventoryId);
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
                inventory: { id: inventoryId },
            },
        });
        if (existingShoppingCartItem) {
            if (count === 0) {
                return await this.shoppingCartRepo.remove(existingShoppingCartItem);
            }
            else {
                existingShoppingCartItem.count = count;
                return await this.shoppingCartRepo.save(existingShoppingCartItem);
            }
        }
        else {
            if (count === 0) {
                throw new OverallError("کالا در سبد وجود ندارد");
            }
            const newShoppingCartItem = new ShoppingCartItem();
            newShoppingCartItem.count = count;
            newShoppingCartItem.user = user;
            newShoppingCartItem.inventory = inventory;
            return await this.shoppingCartRepo.save(newShoppingCartItem);
        }
    }
    async syncShoppingCart(user, items, replace = false) {
        const desired = new Map();
        (items ?? []).forEach((item) => {
            const inventoryId = Number(item?.inventoryId);
            const count = Number(item?.count);
            if (!Number.isInteger(inventoryId) ||
                !Number.isFinite(count) ||
                count < 0) {
                return;
            }
            desired.set(inventoryId, count);
        });
        const inventoryIds = Array.from(desired.keys());
        const inventories = inventoryIds.length > 0
            ? await inventoryService.findInventoryByIds(dataSource.manager, inventoryIds)
            : [];
        const inventoryMap = new Map(inventories.map((inv) => [inv.id, inv]));
        const dbItems = await this.shoppingCartRepo.find({
            where: {
                user: {
                    id: user.id,
                },
            },
            relations: ["inventory"],
        });
        const dbItemMap = new Map(dbItems.map((item) => [item.inventory.id, item]));
        for (const inventoryId of inventoryIds) {
            const requestedCount = desired.get(inventoryId);
            const inventory = inventoryMap.get(inventoryId);
            if (!inventory) {
                continue;
            }
            const clampedCount = Math.min(requestedCount, inventory.quantity);
            const existingItem = dbItemMap.get(inventoryId);
            if (existingItem) {
                const nextCount = replace
                    ? clampedCount
                    : Math.max(existingItem.count, clampedCount);
                if (nextCount <= 0) {
                    await this.shoppingCartRepo.remove(existingItem);
                    dbItemMap.delete(inventoryId);
                }
                else if (nextCount !== existingItem.count) {
                    existingItem.count = nextCount;
                    await this.shoppingCartRepo.save(existingItem);
                }
            }
            else if (clampedCount > 0) {
                const newShoppingCartItem = new ShoppingCartItem();
                newShoppingCartItem.count = clampedCount;
                newShoppingCartItem.user = user;
                newShoppingCartItem.inventory = inventory;
                await this.shoppingCartRepo.save(newShoppingCartItem);
                dbItemMap.set(inventoryId, newShoppingCartItem);
            }
        }
        if (replace) {
            for (const dbItem of dbItems) {
                if (!desired.has(dbItem.inventory.id)) {
                    await this.shoppingCartRepo.remove(dbItem);
                    dbItemMap.delete(dbItem.inventory.id);
                }
            }
        }
        return await this.getUserCart(user.id);
    }
}
export default new ShoppingCartService();
