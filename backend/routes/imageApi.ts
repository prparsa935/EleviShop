import { Router } from "express";

import authController from "../controllers/authController.js";

import { overallErrorHandler } from "../middlewares/errorHandler.js";
import upload from "../utils/uploadPlateImgConfig.js";
import imageController from "../controllers/imageController.js";
const imageApi = Router();
// check user with identify
imageApi.use(authController.authorizeUser, authController.isAdmin);

imageApi.post("/upload",upload.single("file"),imageController.saveimage,overallErrorHandler);

export default imageApi;
