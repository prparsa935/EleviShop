import { Router } from "express";

import authController from "../controllers/authController";

import {
  fieldErrorHandler,
  overallErrorHandler,
} from "../middlewares/errorHandler";
import upload from "../utils/uploadPlateImgConfig";
import imageController from "../controllers/imageController";
import commentController from "../controllers/commentController";
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
