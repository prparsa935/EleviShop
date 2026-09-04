import dataSource from "../utils/dbConfiguration.js";

import { Inventory } from "../models/Inventory.js";
import { EntityManager, In } from "typeorm";
// import { InventorySaveDto } from "../dtos/product.dto.js";
import { plainToClass, plainToInstance } from "class-transformer";
class InventoryService {
  private inventoryRepo = dataSource.getRepository(Inventory);
  async findInventoryById(id: number): Promise<Inventory> {
    const inventory = await this.inventoryRepo.findOne({
      where: {
        id: id,
      },
    });
    return inventory;
  }
  async findInventoryByIds(
    entityManager: EntityManager,
    ids: number[]
  ): Promise<Inventory[]> {
    const inventory = await entityManager.find(Inventory, {
      where: {
        id: In(ids),
      },
      relations: ["product"],
    });
    return inventory;
  }
  async saveInventories(
    entityManager: EntityManager,
    inventies: Inventory[]
  ): Promise<Inventory[]> {
    return await entityManager.save(Inventory, inventies);
  }
}
export default new InventoryService();
