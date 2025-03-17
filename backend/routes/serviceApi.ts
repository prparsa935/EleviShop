import { Router } from "express";
import { overallErrorHandler } from "../middlewares/errorHandler.js";
import serviceController from "../controllers/serviceController.js";
const serviceApi = Router();
// check user with identify

serviceApi.get("/:id", serviceController.findService, overallErrorHandler);
export default serviceApi;
