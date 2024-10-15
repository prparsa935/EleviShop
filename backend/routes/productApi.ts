import { Router } from "express";
import ProductController from "../controllers/productController";
import { body, validationResult, query } from "express-validator";
import { overallErrorHandler } from "../middlewares/errorHandler";
const productApi = Router();
productApi.get("", ProductController.findProducts);
productApi.get("/id/:id", ProductController.findSingleProduct);
productApi.post("/save",ProductController.createproduct,overallErrorHandler)
export default productApi;
