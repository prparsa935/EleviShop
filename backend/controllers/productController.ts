import { NextFunction, Request, Response } from "express";
import { Product } from "../models/product";
import { ProductFilter } from "../types/productTypes";
import ResponseDTO from "../dtos/response.dto";
import ProductService from "../services/productService";
import { plainToInstance } from "class-transformer";
import { ProductSaveDto } from "../dtos/product.dto";
import { validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError";
import productService from "../services/productService";
import FieldErrorsType from "../types/fieldErrors";

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
  // async createproduct(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const productSaveDto = plainToInstance(ProductSaveDto, req.body);
  //     const errors = await validate(productSaveDto);
  //     const flattenErrors = errors.flat();

  
  //     if (flattenErrors.length > 0) {
  //       throw new FieldErrors(flattenErrors);
  //     }
  //     const product = await productService.saveProduct(productSaveDto);
  //     return res.json(product);
  //   } catch (error) {
  //     next(error);
  //   }
  // }
}
export default new ProductController();
