import dataSource from "../utils/dbConfiguration.js";
import {} from "typeorm";
import { Order, orderStatus } from "../models/Order.js";
import { User } from "../models/User.js";
import { instanceToPlain } from "class-transformer";
import { OrderSaveDto } from "../dtos/order.dto.js";
import { OrderInventory } from "../models/OrderInventory.js";
import inventoryService from "./inventoryService.js";
import ResponseDTO from "../dtos/response.dto.js";
import orderInventoryService from "./orderInventoryService.js";
import { OverallError } from "../errors/orderSaveError.js";
import stockMovementService from "./stockMovementService.js";
import { MovementType } from "../models/StockMovement.js";
class OrderService {
  private orderRepo = dataSource.getRepository(Order);

  async findOrderByCurrentStatus(user: User) {
    const orders = await this.orderRepo.find({
      where: [
        {
          orderStatus: orderStatus.waitingForPayment,
          user: {
            id: user.id,
          },
        },
        {
          orderStatus: orderStatus.successfulPayOrValidated,
          user: {
            id: user.id,
          },
        },
        {
          orderStatus: orderStatus.waitingFordelivery,
          user: {
            id: user.id,
          },
        },
      ],
      relations: ["orderInventories.inventory.product.mainImage"],
    });

    return instanceToPlain(orders);
  }
  async findOrderByDeliveredStatus(user: User) {
    const orders = await this.orderRepo.find({
      where: {
        orderStatus: orderStatus.delivered,
        user: {
          id: user.id,
        },
      },
      relations: ["orderInventories.inventory.product.mainImage"],
    });
    return instanceToPlain(orders);
  }
  async findOrderByCancledStatus(user: User) {
    const orders = await this.orderRepo.find({
      where: {
        orderStatus: orderStatus.canceled,
        user: {
          id: user.id,
        },
      },
      relations: ["orderInventories.inventory.product.mainImage"],
    });
    return instanceToPlain(orders);
  }
  async findOrderById(id: number, user: User) {
    const order = await this.orderRepo.findOne({
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },

      relations: ["orderInventories.inventory.product.mainImage", "person"],
    });

    return instanceToPlain(order);
  }
  async saveOrder(orderSaveDto: OrderSaveDto[], user: User): Promise<Order> {
    return dataSource.transaction(async (entityManager) => {
      // استخراج inventoryIds و ایجاد Map برای دسترسی سریع
      const inventoryIds = orderSaveDto.map((dto) => dto.inventory.id);
      const inventories = await inventoryService.findInventoryByIds(
        entityManager,
        inventoryIds
      );
      const inventoryMap = new Map(inventories.map((inv) => [inv.id, inv]));

      // اعتبارسنجی و ساخت OrderInventoryها به‌صورت همزمان
      const orderInventories = orderSaveDto.map((dto) => {
        const inventory = inventoryMap.get(dto.inventory.id);
        if (!inventory) {
          throw new OverallError(
            `محصول با شناسه ${dto.inventory.id} در پایگاه داده موجود نیست`,
            400
          );
        }
        if (inventory.quantity < dto.quantity) {
          throw new OverallError(
            `محصول ${inventory.product.name} به مقدار کافی موجود نیست`,
            400
          );
        }

        const orderInventory = new OrderInventory();
        orderInventory.inventory = inventory;
        orderInventory.quantity = dto.quantity;
        orderInventory.singleProductOffPercent = inventory.product.offPercent;
        orderInventory.singleProductPrice = inventory.price;
        return orderInventory;
      });

      // ذخیره گروهی OrderInventoryها
      const savedOrderInventories =
        await orderInventoryService.saveOrderInventory(
          entityManager,
          orderInventories
        );

      // ایجاد و ذخیره سفارش
      const order = new Order();
      order.user = user;
      order.orderStatus = orderStatus.waitingForPayment;
      order.person = user.person;
      order.orderInventories = savedOrderInventories;

      const savedOrder = await entityManager.save(Order, order);

      for (const dto of orderSaveDto) {
        await stockMovementService.recordMovement(
          dto.inventory.id,
          MovementType.SALE,
          -dto.quantity,
          `سفارش ${savedOrder.trackingCode}`,
          user.id,
          entityManager
        );
      }

      return savedOrder;
    });
  }
}
export default new OrderService();
