import { Router } from "express";

import authController from "../controllers/authController.js";

import {
  fieldErrorHandler,
  overallErrorHandler,
} from "../middlewares/errorHandler.js";
import upload from "../utils/uploadPlateImgConfig.js";
import imageController from "../controllers/imageController.js";
import commentController from "../controllers/commentController.js";
const commentApi = Router();
// check user with identify
commentApi.get(
  "/product/:productId",
  authController.authorizeUserWithoutErr,
  commentController.findProductComments,
  overallErrorHandler
);

commentApi.post(
  "/product/:productId/save",
  authController.authorizeUser,
  authController.isIdentified,
  commentController.CreateProductComment,
  overallErrorHandler
);

// commentApi.post("/add/:id",,overallErrorHandler);

export default commentApi;
