import dataSource from "../utils/dbConfiguration.js";
import { Inventory } from "../models/Inventory.js";
import { In } from "typeorm";
import { plainToInstance } from "class-transformer";
class InventoryService {
    constructor() {
        this.inventoryRepo = dataSource.getRepository(Inventory);
    }
    async findInventoryByIds(entityManager, ids) {
        const inventories = await entityManager.find(Inventory, {
            where: {
                id: In(ids),
            },
            relations: ["product"],
        });
        return inventories;
    }
    async saveInventories(entityManager, inventoriesDto) {
        const inventories = plainToInstance(Inventory, inventoriesDto);
        return await entityManager.save(Inventory, inventories);
    }
}
export default new InventoryService();
