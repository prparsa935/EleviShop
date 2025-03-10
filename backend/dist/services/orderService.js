import dataSource from "../utils/dbConfiguration.js";
import { Order, orderStatus } from "../models/Order.js";
import { instanceToPlain } from "class-transformer";
import { OrderInventory } from "../models/OrderInventory.js";
import inventoryService from "./inventoryService.js";
import orderInventoryService from "./orderInventoryService.js";
import { OverallError } from "../errors/orderSaveError.js";
class OrderService {
    constructor() {
        this.orderRepo = dataSource.getRepository(Order);
    }
    async findOrderByCurrentStatus(user) {
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
    async findOrderByDeliveredStatus(user) {
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
    async findOrderByCancledStatus(user) {
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
    async findOrderById(id, user) {
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
    async saveOrder(orderSaveDto, user) {
        return dataSource.transaction(async (entityManager) => {
            let orderInventories = [];
            const inventoryIds = orderSaveDto.map((orderDto) => orderDto.inventory.id);
            const inventories = await inventoryService.findInventoryByIds(entityManager, inventoryIds);
            // save inventories in map for less database inventory find
            const inventoryMap = new Map(inventories.map((inventory) => [inventory.id, inventory]));
            for (const orderInventoryDto of orderSaveDto) {
                const inventory = inventoryMap.get(orderInventoryDto.inventory.id);
                if (!inventory) {
                    throw new OverallError("یکی از محصولات انتخابی در پایگاه داده موجود نیست", 400);
                }
                if (inventory.quantity < orderInventoryDto.quantity) {
                    throw new OverallError(`محصول ${inventory.product.name} موجود نیست`, 400);
                }
                const orderInventory = new OrderInventory();
                orderInventory.inventory = inventory;
                orderInventory.quantity = orderInventoryDto.quantity;
                orderInventory.singleProductOffPercent = inventory.product.offPercent;
                orderInventory.singleProductPrice = inventory.product.price;
                orderInventories.push(orderInventory);
            }
            orderInventories = await orderInventoryService.saveOrderInventory(entityManager, orderInventories);
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
