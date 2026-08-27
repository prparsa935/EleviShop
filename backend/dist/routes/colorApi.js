import { Router } from "express";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import authController from "../controllers/authController.js";
import colorController from "../controllers/colorController.js";
const colorApi = Router();
colorApi.get("", colorController.findColors);
colorApi.get("/findBy", colorController.findColorByName);
colorApi.get("/id/:id", colorController.findColor);
// admin
colorApi.post("/admin/save", authController.authorizeUser, authController.isAdmin, colorController.createColor, overallErrorHandler);
colorApi.delete("/admin/delete/:id", authController.authorizeUser, authController.isAdmin, colorController.deleteColor, overallErrorHandler);
colorApi.put("/admin/update/:id", authController.authorizeUser, authController.isAdmin, colorController.updateColor, overallErrorHandler);
colorApi.post("/admin/update/:id", authController.authorizeUser, authController.isAdmin, colorController.updateColor, overallErrorHandler);
export default colorApi;
