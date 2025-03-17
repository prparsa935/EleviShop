import { NextFunction, Request, Response } from "express";

import { ProductFilter } from "../types/productTypes.js";
import ResponseDTO from "../dtos/response.dto.js";
import ProductService from "../services/productService.js";
import serviceService from "../services/serviceService.js";
import { OverallError } from "../errors/orderSaveError.js";
import { isNumber } from "class-validator";

class ServiceController {
  async findService(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      if (isNaN(Number(id))) {
        throw new OverallError("سرویسی وجود ندارد");
      }

      res.status(200).json(await serviceService.findServiceById(Number(id)));
    } catch (error) {
      next(error);
    }
  }
}
export default new ServiceController();
