import { Router } from "express";
import productApi from "./productApi";
import categoryApi from "./categoryApi";
import authApi from "./authApi";

const apiRouter = Router();
apiRouter.use("/product", productApi);
apiRouter.use("/category", categoryApi);
apiRouter.use("/auth", authApi);

export default apiRouter;
