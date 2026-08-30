import { NextFunction, Request, Response } from "express";

import productSetService from "../services/productSetService.js";
import { OverallError } from "../errors/orderSaveError.js";

class ProductSetController {
  async findProductSet(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        throw new OverallError("ست محصولی وجود ندارد");
      }

      res
        .status(200)
        .json(await productSetService.findProductSetById(Number(id)));
    } catch (error) {
      next(error);
    }
  }
}
export default new ProductSetController();
