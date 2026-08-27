import { EntityManager, Like } from "typeorm";
import { Color } from "../models/Color.js";
import { Inventory } from "../models/Inventory.js";
import { Product } from "../models/product.js";
import dataSource from "../utils/dbConfiguration.js";
import { OverallError } from "../errors/orderSaveError.js";

class ColorService {
  private colorRepo = dataSource.getRepository(Color);
  private inventoryRepo = dataSource.getRepository(Inventory);
  private productRepo = dataSource.getRepository(Product);
  async findColors(): Promise<Color[]> {
    return await this.colorRepo.find();
  }
  async findColorsByName(name: string): Promise<Color[]> {
    return await this.colorRepo.find({
      where: { name: Like(`%${name}%`) },
    });
  }
  async findColorById(id: number): Promise<Color> {
    return await this.colorRepo.findOne({
      where: {
        id: id,
      },
    });
  }
  async saveColor(color: Color): Promise<Color> {
    return await this.colorRepo.save(color);
  }

  async deleteColor(id: number): Promise<void> {
    const color = await this.findColorById(id);
    if (!color) {
      throw new OverallError("رنگ مورد نظر یافت نشد", 404);
    }

    const productsWithColor = await this.productRepo
      .createQueryBuilder("product")
      .where("product.colorId = :colorId", { colorId: id })
      .getCount();

    if (productsWithColor > 0) {
      throw new OverallError(
        "امکان حذف وجود ندارد: این رنگ در محصولات استفاده شده است",
        400
      );
    }

    await this.colorRepo.remove(color);
  }

  async updateColor(id: number, name: string, hexCode: string): Promise<Color> {
    const color = await this.findColorById(id);
    if (!color) {
      throw new OverallError("رنگ مورد نظر یافت نشد", 404);
    }

    if (name) {
      color.name = name;
    }
    if (hexCode) {
      color.hexCode = hexCode;
    }

    return await this.colorRepo.save(color);
  }
}
export default new ColorService();
