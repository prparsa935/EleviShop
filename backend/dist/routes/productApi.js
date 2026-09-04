import { Router } from "express";
import ProductController from "../controllers/productController.js";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
import productSetController from "../controllers/productSetController.js";
const productApi = Router();
productApi.get("", ProductController.findProducts);
productApi.get("/id/:id", ProductController.findSingleProduct);
productApi.get("/id/:id/code/:code", ProductController.findRelatedProducts, overallErrorHandler);
productApi.get("/pattern/:id", ProductController.findMoldPatternDetail, overallErrorHandler);
productApi.get("/pattern/:id", ProductController.findMoldPatternDetail, overallErrorHandler);
productApi.get("/set/:id/available-colors", productSetController.getAvailableColors, overallErrorHandler);
productApi.get("/set/:id/availability", productSetController.getAvailability, overallErrorHandler);
productApi.post("/set/calc-price", authController.authorizeUser, authController.isAdmin, productSetController.calcSetPricePreview, overallErrorHandler);
// admin
productApi.post("/admin/save", authController.authorizeUser, authController.isAdmin, ProductController.createproduct, overallErrorHandler);
productApi.delete("/admin/delete/:id", authController.authorizeUser, authController.isAdmin, ProductController.deleteProduct, overallErrorHandler);
productApi.put("/admin/update/:id", authController.authorizeUser, authController.isAdmin, ProductController.updateProduct, overallErrorHandler);
// Also support POST for frontend compatibility
productApi.post("/admin/update/:id", authController.authorizeUser, authController.isAdmin, ProductController.updateProduct, overallErrorHandler);
export default productApi;
