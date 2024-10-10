import { Request, Response } from "express";
import { Product } from "../models/product";
import { ProductFilter } from "../types/productTypes";
import ResponseDTO from "../dtos/response.dto";
import ProductService from "../services/productService";

class ProductController {
  async findProducts(req: Request, res: Response) {
    try {
      const filter: ProductFilter = req.query;
      return res
        .status(200)
        .json(await ProductService.findProductsByFillter(filter));
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(new ResponseDTO({}, "خطای درون سروری", false));
    }
  }
  async findSingleProduct(req: Request, res: Response) {
    const productId: number = Number(req.params.id);
    if (isNaN(productId)) {
      return res
        .status(404)
        .json(new ResponseDTO({}, "محصول مورد نظر یافت نشد", false));
    }

    return res.json(await ProductService.findProductById(productId));
  }
}
export default new ProductController();
