import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { body, validationResult, query } from "express-validator";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
const productApi = Router();
productApi.get("", ProductController.findProducts);
productApi.get("/id/:id", ProductController.findSingleProduct);

// admin
// productApi.post(
//   "/admin/save",
//   authController.authorizeUser,
//   authController.isAdmin,
//   ProductController.createproduct,
//   overallErrorHandler
// );
export default productApi;
