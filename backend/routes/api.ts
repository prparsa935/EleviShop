import { Router } from "express";
import productApi from "./productApi";
import categoryApi from "./categoryApi";
import authApi from "./authApi";
import orderApi from "./orderApi";
import authController from "../controllers/authController";
import personApi from "./personApi";
import imageApi from "./imageApi";
import colorApi from "./colorApi";
import commentApi from "./commentApi";

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
