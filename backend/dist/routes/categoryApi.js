import { Router } from "express";
import categoryController from "../controllers/categoryController.js";
const categoryApi = Router();
categoryApi.get("", categoryController.findAllCategoryTree);
export default categoryApi;
