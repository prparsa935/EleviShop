import { OverallError } from "../errors/orderSaveError.js";
import { ShoppingCartItem } from "../models/ShoppingCartItem.js";
import { User } from "../models/User.js";
import dataSource from "../utils/dbConfiguration.js";
import inventoryService from "./inventoryService.js";

class ShoppingCartService {
  private shoppingCartRepo = dataSource.getRepository(ShoppingCartItem);
  async findShoppingCartItemByUserIdAndInventoryId(
    inventoryId: number,
    userId: number
  ) {
    this.shoppingCartRepo.findOne({
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
  async addItemToUserShopingCart(
    inventoryId: number,
    count: number,
    user: User
  ) {
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
      newShoppingCartItem.inventory = inventory;
      return await this.shoppingCartRepo.save(newShoppingCartItem);
    }
  }
}
export default new ShoppingCartService();
