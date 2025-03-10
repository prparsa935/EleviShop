import ResponseDTO from "../dtos/response.dto.js";
import orderService from "../services/orderService.js";
import { isNumberString, validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { OrderSaveDto } from "../dtos/order.dto.js";
import { OverallError } from "../errors/orderSaveError.js";
class OrderController {
    async findCurrentOrders(req, res) {
        try {
            const user = req["user"];
            return res
                .status(200)
                .json(await orderService.findOrderByCurrentStatus(user));
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async findDeliveredOrders(req, res) {
        try {
            const user = req["user"];
            return res
                .status(200)
                .json(await orderService.findOrderByDeliveredStatus(user));
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async findCanceledOrders(req, res) {
        try {
            const user = req["user"];
            return res
                .status(200)
                .json(await orderService.findOrderByCancledStatus(user));
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async orderDetail(req, res) {
        try {
            const { id } = req.params;
            const user = req["user"];
            if (!isNumberString(id))
                return res
                    .status(500)
                    .json(new ResponseDTO({}, { message: "سفارش مورد نظر یافت نشد" }, false));
            return res
                .status(200)
                .json(await orderService.findOrderById(Number(id), user));
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async saveOrder(req, res, next) {
        try {
            const user = req["user"];
            const orderSaveDtos = req.body.map((order) => plainToInstance(OrderSaveDto, order));
            const errors = await Promise.all(orderSaveDtos.map((orderSaveDto) => validate(orderSaveDto)));
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
        }
        catch (error) {
            next(error);
        }
    }
}
export default new OrderController();
