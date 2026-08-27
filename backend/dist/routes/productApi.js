import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
const productApi = Router();
productApi.get("", ProductController.findProducts);
productApi.get("/id/:id", ProductController.findSingleProduct);
// admin
productApi.post("/admin/save", authController.authorizeUser, authController.isAdmin, ProductController.createproduct, overallErrorHandler);
productApi.delete("/admin/delete/:id", authController.authorizeUser, authController.isAdmin, ProductController.deleteProduct, overallErrorHandler);
productApi.put("/admin/update/:id", authController.authorizeUser, authController.isAdmin, ProductController.updateProduct, overallErrorHandler);
// Also support POST for frontend compatibility
productApi.post("/admin/update/:id", authController.authorizeUser, authController.isAdmin, ProductController.updateProduct, overallErrorHandler);
export default productApi;
