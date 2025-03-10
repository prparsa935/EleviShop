import dataSource from "../utils/dbConfiguration.js";

import { Inventory } from "../models/Inventory.js";
import { EntityManager, In } from "typeorm";
import { InventorySaveDto } from "../dtos/product.dto.js";
import { plainToClass, plainToInstance } from "class-transformer";
class InventoryService {
  private inventoryRepo = dataSource.getRepository(Inventory);

  async findInventoryByIds(
    entityManager: EntityManager,
    ids: number[]
  ): Promise<Inventory[]> {
    const inventories = await entityManager.find(Inventory, {
      where: {
        id: In(ids),
      },
      relations: ["product"],
    });
    return inventories;
  }
  async saveInventories(
    entityManager: EntityManager,
    inventoriesDto: InventorySaveDto[]
  ): Promise<Inventory[]> {
    const inventories = plainToInstance(Inventory, inventoriesDto);
    return await entityManager.save(Inventory, inventories);
  }
}
export default new InventoryService();
