import { Router } from "express";
import orderController from "../controllers/orderController.js";
import authController from "../controllers/authController.js";
const orderApi = Router();
// check user with identify
orderApi.use(authController.authorizeUser);
orderApi.get("/current", orderController.findCurrentOrders);
orderApi.get("/delivered", orderController.findDeliveredOrders);
orderApi.get("/canceled", orderController.findCanceledOrders);
orderApi.get("/id/:id", orderController.orderDetail);
orderApi.post("/save", orderController.saveOrder);
// orderApi.post("/save", orderController.saveOrder, overallErrorHandler);
export default orderApi;
