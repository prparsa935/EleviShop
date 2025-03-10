import { Router } from "express";

import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
import ColorController from "../controllers/colorController.js";
import colorController from "../controllers/colorController.js";
const colorApi = Router();
colorApi.get("", colorController.findColors);
colorApi.get("/id/:id", colorController.findColor);

// admin
colorApi.post(
  "/admin/save",
  authController.authorizeUser,
  authController.isAdmin,
  colorController.createColor,
  overallErrorHandler
);
export default colorApi;
