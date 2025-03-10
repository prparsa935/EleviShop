import dataSource from "../utils/dbConfiguration.js";

import { User } from "../models/User.js";
import { instanceToPlain } from "class-transformer";
import { OrderInventory } from "../models/OrderInventory.js";
import { EntityManager } from "typeorm";
class OrderInventoryService {
  private orderInventoryRepo = dataSource.getRepository(OrderInventory);

  async saveOrderInventory(
    entityManager: EntityManager,
    orderInventories: OrderInventory[]
  ): Promise<OrderInventory[]> {
    const savedOrderInventories = await entityManager.save(
      OrderInventory,
      orderInventories
    );
    return savedOrderInventories;
  }
}
export default new OrderInventoryService();
