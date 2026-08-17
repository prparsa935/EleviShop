import dataSource from "../utils/dbConfiguration.js";
import { Inventory } from "../models/Inventory.js";
import { In } from "typeorm";
class InventoryService {
    constructor() {
        this.inventoryRepo = dataSource.getRepository(Inventory);
    }
    async findInventoryById(id) {
        const inventory = await this.inventoryRepo.findOne({
            where: {
                id: id,
            },
        });
        return inventory;
    }
    async findInventoryByIds(entityManager, ids) {
        const inventory = await entityManager.find(Inventory, {
            where: {
                id: In(ids),
            },
            relations: ["product"],
        });
        return inventory;
    }
    async saveInventories(entityManager, inventies) {
        return await entityManager.save(Inventory, inventies);
    }
}
export default new InventoryService();
