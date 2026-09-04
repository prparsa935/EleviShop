import { NextFunction, Request, Response } from "express";

import { ProductFilter } from "../types/productTypes.js";
import ResponseDTO from "../dtos/response.dto.js";
import ProductService from "../services/productService.js";
import { plainToClass, plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import {
  PlateSaveDto,
  ProductSetSaveDto,
  UpdateProductDto,
} from "../dtos/product.dto.js";
// import { ProductSaveDto } from "../dtos/product.dto.js";

// the saved entity holds back-references (set items -> set, inventories ->
// product) that make res.json throw a circular-structure TypeError AFTER the
// transaction already committed — the caller then saw a 500 and treated a
// successful save as failed. Module-level because route handlers are passed
// as bare function references, so class methods would lose their `this`.
const saveResult = (product: { id: number; type: string }) => ({
  id: product.id,
  type: product.type,
});

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

    const product = await ProductService.findProductById(productId);
    if (!product) {
      try {
        return res.json(await ProductService.findMoldPatternDetail(productId));
      } catch {
        return res
          .status(404)
          .json(
            new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false)
          );
      }
    }
    return res.json(product);
  }

  async findMoldPatternDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const moldPatternId: number = Number(req.params.id);
      if (isNaN(moldPatternId)) {
        return res
          .status(404)
          .json(
            new ResponseDTO({}, { message: "طرح مورد نظر یافت نشد" }, false)
          );
      }
      return res.json(
        await ProductService.findMoldPatternDetail(moldPatternId)
      );
    } catch (error) {
      next(error);
    }
  }

  async findRelatedProducts(req: Request, res: Response) {
    try {
      const productId: number = Number(req.params.id);
      const code: string = req.params.code;
      if (isNaN(productId)) {
        return res
          .status(404)
          .json(
            new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false)
          );
      }
      return res.json(
        await ProductService.findRelatedProducts(productId, code)
      );
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }

  async createproduct(req: Request, res: Response, next: NextFunction) {
    try {
      const type = req.body["type"];
      let productSaveDto: PlateSaveDto | ProductSetSaveDto;
      if (type === "plate") {
        productSaveDto = plainToInstance(PlateSaveDto, req.body);
      } else if (type === "productSet") {
        productSaveDto = plainToInstance(ProductSetSaveDto, req.body);
      } else {
        throw new OverallError("Invalid product type");
      }
      const errors = await validate(productSaveDto);
      const flattenErrors = errors.flat();

      if (flattenErrors.length > 0) {
        throw new FieldErrors(flattenErrors);
      }
      const product = await ProductService.saveProduct(productSaveDto);
      return res.json(
        new ResponseDTO(
          null,
          null,
          true,
          "محصول با موفقیت ثبت شد",
          saveResult(product)
        )
      );
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId: number = Number(req.params.id);
      if (isNaN(productId)) {
        return res
          .status(404)
          .json(
            new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false)
          );
      }
      await ProductService.deleteProduct(productId);
      return res.json(
        new ResponseDTO(null, null, true, "محصول با موفقیت حذف شد")
      );
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const productId: number = Number(req.params.id);
      if (isNaN(productId)) {
        return res
          .status(404)
          .json(
            new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false)
          );
      }
      const updateDto = plainToInstance(UpdateProductDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0) {
        throw new FieldErrors(errors);
      }
      const product = await ProductService.updateProduct(productId, updateDto);
      return res.json(
        new ResponseDTO(
          null,
          null,
          true,
          "محصول با موفقیت به‌روزرسانی شد",
          saveResult(product)
        )
      );
    } catch (error) {
      console.error("Update product error:", error);
      next(error);
    }
  }
}
export default new ProductController();
