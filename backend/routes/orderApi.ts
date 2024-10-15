import { Request, Response, Router } from "express";
import ProductController from "../controllers/productController";
import { body, validationResult, query } from "express-validator";
import orderController from "../controllers/orderController";
import authController from "../controllers/authController";
import { orderStatus } from "../models/Order";
import { overallErrorHandler } from "../middlewares/errorHandler";
const orderApi = Router();
// check user with identify
orderApi.use(authController.authorizeUser);

orderApi.get("/current", orderController.findCurrentOrders);
orderApi.get("/delivered", orderController.findDeliveredOrders);
orderApi.get("/canceled", orderController.findCanceledOrders);
orderApi.get("/id/:id", orderController.orderDetail);
orderApi.post("/save", orderController.saveOrder, overallErrorHandler);
export default orderApi;
