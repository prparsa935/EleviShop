import dataSource from "../utils/dbConfiguration";

import { User } from "../models/User";
import { instanceToPlain } from "class-transformer";
import { OrderInventory } from "../models/OrderInventory ";
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
