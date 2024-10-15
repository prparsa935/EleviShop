import dataSource from "../utils/dbConfiguration";

import { Inventory } from "../models/Inventory";
import { EntityManager, In } from "typeorm";
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
}
export default new InventoryService();
