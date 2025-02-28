import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product";
import { ProductFilter } from "../types/productTypes";
import ResponseDTO from "../dtos/response.dto";
import ProductService from "../services/productService";
import orderService from "../services/orderService";
import { User } from "../models/User";
import { isNumberString, validate } from "class-validator";
import { plainToClass, plainToInstance } from "class-transformer";
import { OrderSaveDto } from "../dtos/order.dto";
import inventoryService from "../services/inventoryService";
import { OrderInventory } from "../models/OrderInventory ";
import { Order, orderStatus } from "../models/Order";
import orderInventoryService from "../services/orderInventoryService";
import dataSource from "../utils/dbConfiguration";
import { OverallError } from "../errors/orderSaveError";

class OrderController {
  async findCurrentOrders(req: Request, res: Response) {
    try {
      const user: User = req["user"];
      return res
        .status(200)
        .json(await orderService.findOrderByCurrentStatus(user));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
  async findDeliveredOrders(req: Request, res: Response) {
    try {
      const user: User = req["user"];
      return res
        .status(200)
        .json(await orderService.findOrderByDeliveredStatus(user));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
  async findCanceledOrders(req: Request, res: Response) {
    try {
      const user: User = req["user"];
      return res
        .status(200)
        .json(await orderService.findOrderByCancledStatus(user));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
  async orderDetail(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user: User = req["user"];
      if (!isNumberString(id))
        return res
          .status(500)
          .json(
            new ResponseDTO({}, { message: "سفارش مورد نظر یافت نشد" }, false)
          );
      return res
        .status(200)
        .json(await orderService.findOrderById(Number(id), user));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }

  async saveOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req["user"];
      const orderSaveDtos: OrderSaveDto[] = req.body.map((order) =>
        plainToInstance(OrderSaveDto, order)
      );


      const errors = await Promise.all(
        orderSaveDtos.map((orderSaveDto) => validate(orderSaveDto))
      );
      const flattenErrors = errors.flat();

      if (flattenErrors.length > 0) {
        throw new OverallError("لطفا محصولات داخل سبد را تغییر دهید", 400);
      }
      // if shaopping cart is empty
      if (orderSaveDtos.length === 0) {
        throw new OverallError("سبد خرید شما خالی است", 404);
      }
      await orderService.saveOrder(orderSaveDtos, user);
      res
        .status(200)
        .json(new ResponseDTO(null, null, true, "سفارش شما با موفقیت ثبت شد"));
    } catch (error) {
      
      next(error);
    }
  }
}
export default new OrderController();
