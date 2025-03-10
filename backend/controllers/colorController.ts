import { NextFunction, Request, Response } from "express";
import { Color } from "../models/Color.js";
import { plainToInstance } from "class-transformer";
import { validate, Validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import colorService from "../services/colorService.js";
import ResponseDTO from "../dtos/response.dto.js";

class ColorController {
  async createColor(req: Request, res: Response, next: NextFunction) {
    try {
      const color = plainToInstance(Color, req.body);
      const errors = await validate(color);
      if (errors.length > 0) {
        throw new FieldErrors(errors);
      }
      await colorService.saveColor(color);
      res
        .status(200)
        .json(new ResponseDTO(null, null, true, "رنگ با موفقیت ثبت شد", color));
    } catch (error) {
      next(error);
    }
  }
  async findColor(req: Request, res: Response, next: NextFunction) {
    try {
      const colorId: number = Number(req.params.id);
      if (isNaN(colorId)) {
        throw new OverallError("رنگ مورد نظر یافت نشد", 404);
      }

      return res.json(await colorService.findColorById(colorId));
    } catch (error) {
      next(error);
    }
  }
  async findColors(req: Request, res: Response, next: NextFunction) {
    try {
      return res.json(await colorService.findColors());
    } catch (error) {
      next(error);
    }
  }
}
export default new ColorController();
