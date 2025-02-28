import { Router } from "express";

import authController from "../controllers/authController";

import { overallErrorHandler } from "../middlewares/errorHandler";
import upload from "../utils/uploadPlateImgConfig";
import imageController from "../controllers/imageController";
const imageApi = Router();
// check user with identify
imageApi.use(authController.authorizeUser, authController.isAdmin);

imageApi.post("/upload",upload.single("file"),imageController.saveimage,overallErrorHandler);

export default imageApi;
