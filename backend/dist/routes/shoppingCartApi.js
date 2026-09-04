import { Router } from "express";
import authController from "../controllers/authController.js";
import shoppingCartController from "../controllers/shoppingCartController.js";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
const shoppingCartApi = Router();
shoppingCartApi.use(authController.authorizeUser, authController.isIdentified);
shoppingCartApi.get("/", shoppingCartController.getShoppingCart, overallErrorHandler);
shoppingCartApi.post("/sync", shoppingCartController.syncShoppingCart, overallErrorHandler);
export default shoppingCartApi;
