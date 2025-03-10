import { Router } from "express";

import { body, validationResult, query } from "express-validator";
import categoryController from "../controllers/categoryController.js";
const categoryApi = Router();
categoryApi.get("", categoryController.findAllCategoryTree);

export default categoryApi;
