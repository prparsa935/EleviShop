import dataSource from "../utils/dbConfiguration.js";
import { Between } from "typeorm";
import { StockMovement, MovementType } from "../models/StockMovement.js";
import { Inventory } from "../models/Inventory.js";
import { OverallError } from "../errors/orderSaveError.js";
class StockMovementService {
    constructor() {
        this.stockMovementRepo = dataSource.getRepository(StockMovement);
    }
    async recordMovement(inventoryId, type, quantityChange, reason, userId, entityManager) {
        const execute = async (manager) => {
            const inventory = await manager.findOne(Inventory, {
                where: { id: inventoryId },
            });
            if (!inventory) {
                throw new OverallError(`موجودی با شناسه ${inventoryId} یافت نشد`, 404);
            }
            const newQuantity = inventory.quantity + quantityChange;
            inventory.quantity = newQuantity;
            await manager.save(Inventory, inventory);
            const movement = new StockMovement();
            movement.inventory = inventory;
            movement.type = type;
            movement.quantityChange = quantityChange;
            movement.quantityAfter = newQuantity;
            movement.reason = reason || null;
            if (userId) {
                movement.performedBy = { id: userId };
            }
            return manager.save(StockMovement, movement);
        };
        if (entityManager) {
            return execute(entityManager);
        }
        return dataSource.transaction(execute);
    }
    async getMovementHistory(inventoryId) {
        return this.stockMovementRepo.find({
            where: { inventory: { id: inventoryId } },
            relations: ["inventory", "performedBy"],
            order: { dateCreated: "DESC" },
        });
    }
    async getLowStockItems(threshold) {
        const inventoryRepo = dataSource.getRepository(Inventory);
        const qb = inventoryRepo.createQueryBuilder("inv");
        if (threshold !== undefined) {
            qb.where("inv.quantity <= :threshold", { threshold });
        }
        else {
            qb.where("inv.quantity <= inv.lowStockThreshold");
        }
        qb.leftJoinAndSelect("inv.product", "product");
        return qb.getMany();
    }
    async getSlowMovingItems(dateRangeInMonths, salesThreshold) {
        const inventoryRepo = dataSource.getRepository(Inventory);
        const now = new Date();
        const startDate = new Date();
        startDate.setMonth(now.getMonth() - dateRangeInMonths);
        const inventories = await inventoryRepo.find({
            relations: ["product"],
        });
        const slowMoving = [];
        for (const inv of inventories) {
            const salesCount = await this.stockMovementRepo.count({
                where: {
                    inventory: { id: inv.id },
                    type: MovementType.SALE,
                    dateCreated: Between(startDate, now),
                },
            });
            if (salesCount < salesThreshold) {
                slowMoving.push(inv);
            }
        }
        return slowMoving;
    }
}
export default new StockMovementService();
