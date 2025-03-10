import { Router } from "express";
import productApi from "./productApi.js";
import categoryApi from "./categoryApi.js";
import authApi from "./authApi.js";
import orderApi from "./orderApi.js";
import authController from "../controllers/authController.js";
import personApi from "./personApi.js";
import imageApi from "./imageApi.js";
import colorApi from "./colorApi.js";
import commentApi from "./commentApi.js";

const apiRouter = Router();
apiRouter.use("/product", productApi);
apiRouter.use("/category", categoryApi);
apiRouter.use("/order", orderApi);
apiRouter.use("/person", personApi);
apiRouter.use("/auth", authApi);
apiRouter.use("/image", imageApi);
apiRouter.use("/color", colorApi);
apiRouter.use("/comment", commentApi);

export default apiRouter;
