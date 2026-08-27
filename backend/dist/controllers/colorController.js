import { Color } from "../models/Color.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import colorService from "../services/colorService.js";
import ResponseDTO from "../dtos/response.dto.js";
class ColorController {
    async createColor(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
    async findColor(req, res, next) {
        try {
            const colorId = Number(req.params.id);
            if (isNaN(colorId)) {
                throw new OverallError("رنگ مورد نظر یافت نشد", 404);
            }
            return res.json(await colorService.findColorById(colorId));
        }
        catch (error) {
            next(error);
        }
    }
    async findColors(req, res, next) {
        try {
            return res.json(await colorService.findColors());
        }
        catch (error) {
            next(error);
        }
    }
    async findColorByName(req, res, next) {
        try {
            const colorName = req.query.colorName;
            if (!colorName) {
                return res.json(await colorService.findColors());
            }
            return res.json(await colorService.findColorsByName(colorName));
        }
        catch (error) {
            next(error);
        }
    }
    async deleteColor(req, res, next) {
        try {
            const colorId = Number(req.params.id);
            if (isNaN(colorId)) {
                throw new OverallError("رنگ مورد نظر یافت نشد", 404);
            }
            await colorService.deleteColor(colorId);
            return res.json(new ResponseDTO(null, null, true, "رنگ با موفقیت حذف شد"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateColor(req, res, next) {
        try {
            const colorId = Number(req.params.id);
            if (isNaN(colorId)) {
                throw new OverallError("رنگ مورد نظر یافت نشد", 404);
            }
            const { name, hexCode } = req.body;
            const color = await colorService.updateColor(colorId, name, hexCode);
            return res.json(new ResponseDTO(null, null, true, "رنگ با موفقیت به‌روزرسانی شد", color));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new ColorController();
