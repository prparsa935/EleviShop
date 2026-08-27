import dataSource from "../utils/dbConfiguration.js";
import { EntityManager } from "typeorm";
import { StockMovement, MovementType } from "../models/StockMovement.js";
import { Inventory } from "../models/Inventory.js";
import { OverallError } from "../errors/orderSaveError.js";

class StockMovementService {
  private stockMovementRepo = dataSource.getRepository(StockMovement);

  async recordMovement(
    inventoryId: number,
    type: MovementType,
    quantityChange: number,
    reason?: string,
    userId?: number,
    entityManager?: EntityManager
  ): Promise<StockMovement> {
    const execute = async (manager: EntityManager) => {
      const inventory = await manager.findOne(Inventory, {
        where: { id: inventoryId },
      });
      if (!inventory) {
        throw new OverallError(
          `موجودی با شناسه ${inventoryId} یافت نشد`,
          404
        );
      }
      const newQuantity = inventory.quantity + quantityChange;
      if (newQuantity < 0) {
        throw new OverallError(
          `موجودی کافی نیست. موجودی فعلی: ${inventory.quantity}`,
          400
        );
      }
      inventory.quantity = newQuantity;
      await manager.save(Inventory, inventory);

      const movement = new StockMovement();
      movement.inventory = inventory;
      movement.type = type;
      movement.quantityChange = quantityChange;
      movement.quantityAfter = newQuantity;
      movement.reason = reason || null;
      if (userId) {
        movement.performedBy = { id: userId } as any;
      }
      return manager.save(StockMovement, movement);
    };

    if (entityManager) {
      return execute(entityManager);
    }
    return dataSource.transaction(execute);
  }

  async getMovementHistory(inventoryId: number): Promise<StockMovement[]> {
    return this.stockMovementRepo.find({
      where: { inventory: { id: inventoryId } },
      relations: ["inventory", "performedBy"],
      order: { dateCreated: "DESC" },
    });
  }

  async getLowStockItems(threshold?: number): Promise<Inventory[]> {
    const inventoryRepo = dataSource.getRepository(Inventory);
    const qb = inventoryRepo.createQueryBuilder("inv");
    if (threshold !== undefined) {
      qb.where("inv.quantity <= :threshold", { threshold });
    } else {
      qb.where("inv.quantity <= inv.lowStockThreshold");
    }
    qb.leftJoinAndSelect("inv.product", "product");
    return qb.getMany();
  }
}

export default new StockMovementService();
