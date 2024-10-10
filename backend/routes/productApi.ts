import { Router } from "express";
import ProductController from "../controllers/productController";
import { body, validationResult, query } from "express-validator";
const productApi = Router();
productApi.get("", ProductController.findProducts);
productApi.get("/id/:id", ProductController.findSingleProduct);
export default productApi;
