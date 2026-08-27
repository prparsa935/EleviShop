import { Router } from "express";
import stockController from "../controllers/stockController.js";
import authController from "../controllers/authController.js";

const stockApi = Router();

stockApi.use(authController.authorizeUser);
stockApi.use(authController.isAdmin);

stockApi.get("/movements/:inventoryId", stockController.getMovementHistory);
stockApi.post("/adjust", stockController.adjustStock);
stockApi.get("/low-stock", stockController.getLowStock);

export default stockApi;
