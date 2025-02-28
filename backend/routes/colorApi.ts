import { Router } from "express";

import { overallErrorHandler } from "../middlewares/errorHandler";
import authController from "../controllers/authController";
import ColorController from "../controllers/colorController";
import colorController from "../controllers/colorController";
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
