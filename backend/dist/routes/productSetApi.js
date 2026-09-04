import { Router } from "express";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import productSetController from "../controllers/productSetController.js";
const productSetApi = Router();
productSetApi.get("/:id", productSetController.findProductSet, overallErrorHandler);
export default productSetApi;
