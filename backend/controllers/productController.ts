import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product";
import { ProductFilter } from "../types/productTypes";
import ResponseDTO from "../dtos/response.dto";
import ProductService from "../services/productService";
import { plainToInstance } from "class-transformer";
import { ProductSaveDto } from "../dtos/product.dto";
import { validate } from "class-validator";
import { OverallError } from "../errors/orderSaveError";

class ProductController {
  async findProducts(req: Request, res: Response) {
    try {
      const filter: ProductFilter = req.query;
      console.log(filter);
      return res
        .status(200)
        .json(await ProductService.findProductsByFillter(filter));
    } catch (error) {
      console.log(error);
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
      const productSaveDto = plainToInstance(ProductSaveDto, req.body);
      const flattenErrors = (await validate(productSaveDto)).flat;

      if (flattenErrors.length > 0) {
        throw new OverallError("لطفا محصولات داخل سبد را تغییر دهید", 400);
      }
    } catch (error) {
      next(error);
    }
  }
}
export default new ProductController();
