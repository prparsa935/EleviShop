import { NextFunction, Request, Response } from "express";

import { ProductFilter } from "../types/productTypes.js";
import ResponseDTO from "../dtos/response.dto.js";
import ProductService from "../services/productService.js";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import {
  PlateSaveDto,
  ProductSaveDto,
  ServiceSaveDto,
} from "../dtos/product.dto.js";
// import { ProductSaveDto } from "../dtos/product.dto.js";

class ProductController {
  async findProducts(req: Request, res: Response) {
    try {
      const filter: ProductFilter = req.query;

      return res
        .status(200)
        .json(await ProductService.findProductsByFillter(filter));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }
  async findSingleProduct(req: Request, res: Response) {
    const productId: number = Number(req.params.id);
    if (isNaN(productId)) {
      return res
        .status(404)
        .json(
          new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false)
        );
    }

    return res.json(await ProductService.findProductById(productId));
  }

  async createproduct(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.body["type"];
      let productSaveDto: PlateSaveDto | ServiceSaveDto;
      if (type === "plate") {
        productSaveDto = plainToInstance(PlateSaveDto, req.body);
      } else if (type === "service") {
        productSaveDto = plainToInstance(ServiceSaveDto, req.body);
      } else {
        throw new OverallError("Invalid product type");
      }
      const errors = await validate(productSaveDto);
      const flattenErrors = errors.flat();

      if (flattenErrors.length > 0) {
        throw new FieldErrors(flattenErrors);
      }
      const product = await ProductService.saveProduct(productSaveDto);
      return res.json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
export default new ProductController();
