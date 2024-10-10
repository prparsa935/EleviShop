import { Router } from "express";

import { body, validationResult, query } from "express-validator";
import categoryController from "../controllers/categoryController";
const categoryApi = Router();
categoryApi.get("", categoryController.findAllCategoryTree);

export default categoryApi;
