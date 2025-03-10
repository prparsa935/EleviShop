import dataSource from "../utils/dbConfiguration.js";
import { OrderInventory } from "../models/OrderInventory.js";
class OrderInventoryService {
    constructor() {
        this.orderInventoryRepo = dataSource.getRepository(OrderInventory);
    }
    async saveOrderInventory(entityManager, orderInventories) {
        const savedOrderInventories = await entityManager.save(OrderInventory, orderInventories);
        return savedOrderInventories;
    }
}
export default new OrderInventoryService();
