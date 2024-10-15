import dataSource from "../utils/dbConfiguration";
import {} from "typeorm";
import { Order, orderStatus } from "../models/Order";
import { User } from "../models/User";
import { instanceToPlain } from "class-transformer";
import { OrderSaveDto } from "../dtos/order.dto";
import { OrderInventory } from "../models/OrderInventory ";
import inventoryService from "./inventoryService";
import ResponseDTO from "../dtos/response.dto";
import orderInventoryService from "./orderInventoryService";
import { OverallError } from "../errors/orderSaveError";
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
      let orderInventories: OrderInventory[] = [];
      const inventoryIds = orderSaveDto.map(
        (orderDto) => orderDto.inventory.id
      );
      const inventories = await inventoryService.findInventoryByIds(
        entityManager,
        inventoryIds
      );
      // save inventories in map for less database inventory find
      const inventoryMap = new Map(
        inventories.map((inventory) => [inventory.id, inventory])
      );
      for (const orderInventoryDto of orderSaveDto) {
        const inventory = inventoryMap.get(orderInventoryDto.inventory.id);
        if (!inventory) {
          throw new OverallError(
            "یکی از محصولات انتخابی در پایگاه داده موجود نیست",
            400
          );
        }
        if (inventory.quantity < orderInventoryDto.quantity) {
          throw new OverallError(
            `محصول ${inventory.product.name} موجود نیست`,
            400
          );
        }
        const orderInventory = new OrderInventory();
        orderInventory.inventory = inventory;
        orderInventory.quantity = orderInventoryDto.quantity;
        orderInventory.singleProductOffPercent = inventory.product.offPercent;
        orderInventory.singleProductPrice = inventory.product.price;
        orderInventories.push(orderInventory);
      }
      orderInventories = await orderInventoryService.saveOrderInventory(
        entityManager,
        orderInventories
      );

      const order = new Order();
      order.user = user;
      order.orderStatus = orderStatus.waitingForPayment;
      order.person = user.person;
      order.orderInventories = orderInventories;
      await entityManager.save(Order, order);
      return order;
    });
  }
}
export default new OrderService();
