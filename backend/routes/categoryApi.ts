import { Router } from "express";

import { body, validationResult, query } from "express-validator";
import categoryController from "../controllers/categoryController.js";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
const categoryApi = Router();
categoryApi.get("", categoryController.findAllCategoryTree);
categoryApi.get(
  "/id/:id",
  categoryController.findCategoryById,
  overallErrorHandler
);
// admin auth
categoryApi.use(authController.authorizeUser, authController.isAdmin);

categoryApi.post(
  "/admin/save",
  categoryController.createCategory,
  overallErrorHandler
);
categoryApi.delete(
  "/admin/delete/:id",
  categoryController.deleteCategory,
  overallErrorHandler
);
categoryApi.put(
  "/admin/update/:id",
  categoryController.updateCategory,
  overallErrorHandler
);
categoryApi.post(
  "/admin/update/:id",
  categoryController.updateCategory,
  overallErrorHandler
);

export default categoryApi;
