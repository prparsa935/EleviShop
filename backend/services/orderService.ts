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
import { ProductSetItem } from "../models/ProductSetItem.js";
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
      const simpleDtos = orderSaveDto.filter(
        (dto) => dto.itemType !== "SET"
      );
      const setDtos = orderSaveDto.filter((dto) => dto.itemType === "SET");

      if (simpleDtos.some((dto) => !dto.inventory)) {
        throw new OverallError("محصول انتخابی اشتباه است", 400);
      }

      // استخراج inventoryIds و ایجاد Map برای دسترسی سریع
      const inventoryIds = simpleDtos.map((dto) => dto.inventory.id);
      const inventories = await inventoryService.findInventoryByIds(
        entityManager,
        inventoryIds
      );
      const inventoryMap = new Map(inventories.map((inv) => [inv.id, inv]));

      interface ResolvedSetComponent {
        inventoryId: number;
        totalQuantity: number;
      }
      const resolvedSetComponents: ResolvedSetComponent[] = [];

      // اعتبارسنجی و ساخت OrderInventoryها برای آیتم‌های ساده
      const orderInventories: OrderInventory[] = [];
      for (const dto of simpleDtos) {
        const inventory = inventoryMap.get(dto.inventory.id);
        if (!inventory) {
          throw new OverallError(
            `محصول با شناسه ${dto.inventory.id} در پایگاه داده موجود نیست`,
            400
          );
        }
        const orderInventory = new OrderInventory();
        orderInventory.inventory = inventory;
        orderInventory.quantity = dto.quantity;
        orderInventory.singleProductOffPercent = inventory.product.offPercent;
        orderInventory.singleProductPrice = inventory.price;
        orderInventories.push(orderInventory);
      }

      // گسترش آیتم‌های SET به OrderInventory برای تک‌تک قطعات سرویس
      for (const dto of setDtos) {
        if (!dto.productSetId || !dto.colorId) {
          throw new OverallError("اطلاعات سرویس انتخابی ناقص است", 400);
        }
        const setItems = await entityManager.find(ProductSetItem, {
          where: { productSet: { id: dto.productSetId } },
          relations: [
            "plate",
            "plate.inventories",
            "plate.inventories.product",
          ],
        });
        if (!setItems || setItems.length === 0) {
          throw new OverallError(
            "سرویس مورد نظر یافت نشد یا آیتمی ندارد",
            404
          );
        }
        for (const item of setItems) {
          const plateInventories = (item.plate?.inventories ?? []).filter(
            (inv) => inv.colorId === dto.colorId
          );
          const componentInventory = plateInventories
            .slice()
            .sort((a, b) => (b.quantity ?? 0) - (a.quantity ?? 0))[0];
          if (!componentInventory) {
            throw new OverallError(
              `قطعه «${
                item.plate?.name ?? item.plate?.id
              }» در رنگ انتخابی موجود نیست`,
              400
            );
          }
          const totalQuantity = (item.quantity || 1) * dto.quantity;
          if ((componentInventory.quantity ?? 0) < totalQuantity) {
            throw new OverallError(
              `موجودی قطعه «${
                item.plate?.name ?? item.plate?.id
              }» برای این سفارش کافی نیست`,
              400
            );
          }
          const orderInventory = new OrderInventory();
          orderInventory.inventory = componentInventory;
          orderInventory.quantity = totalQuantity;
          orderInventory.singleProductOffPercent =
            componentInventory.product?.offPercent ?? 0;
          orderInventory.singleProductPrice = componentInventory.price;
          orderInventories.push(orderInventory);
          resolvedSetComponents.push({
            inventoryId: componentInventory.id,
            totalQuantity,
          });
        }
      }

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

      for (const dto of simpleDtos) {
        await stockMovementService.recordMovement(
          dto.inventory.id,
          MovementType.SALE,
          -dto.quantity,
          `سفارش ${savedOrder.trackingCode}`,
          user.id,
          entityManager
        );

        const inventory = inventoryMap.get(dto.inventory.id);
        if (inventory?.product?.type === "productSet") {
          const setItems = await entityManager.find(ProductSetItem, {
            where: { productSet: { id: inventory.product.id } },
            relations: ["plate", "plate.inventories"],
          });
          for (const item of setItems) {
            const plateInventory =
              item.plate.inventories?.find((inv) => inv.quantity > 0) ??
              item.plate.inventories?.[0];
            if (!plateInventory) {
              continue;
            }
            await stockMovementService.recordMovement(
              plateInventory.id,
              MovementType.BUNDLE_SALE,
              -(item.quantity * dto.quantity),
              `فروش ست محصول - سفارش ${savedOrder.trackingCode}`,
              user.id,
              entityManager
            );
          }
        }
      }

      for (const component of resolvedSetComponents) {
        await stockMovementService.recordMovement(
          component.inventoryId,
          MovementType.BUNDLE_SALE,
          -component.totalQuantity,
          `فروش سرویس - سفارش ${savedOrder.trackingCode}`,
          user.id,
          entityManager
        );
      }

      return savedOrder;
    });
  }
}
export default new OrderService();
