import ResponseDTO from "../dtos/response.dto.js";
import ProductService from "../services/productService.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import { PlateSaveDto, ServiceSaveDto, UpdateProductDto, } from "../dtos/product.dto.js";
// import { ProductSaveDto } from "../dtos/product.dto.js";
class ProductController {
    async findProducts(req, res) {
        try {
            const filter = req.query;
            return res
                .status(200)
                .json(await ProductService.findProductsByFillter(filter));
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async findSingleProduct(req, res) {
        const productId = Number(req.params.id);
        if (isNaN(productId)) {
            return res
                .status(404)
                .json(new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false));
        }
        return res.json(await ProductService.findProductById(productId));
    }
    async createproduct(req, res, next) {
        try {
            const type = req.body["type"];
            let productSaveDto;
            if (type === "plate") {
                productSaveDto = plainToInstance(PlateSaveDto, req.body);
            }
            else if (type === "service") {
                productSaveDto = plainToInstance(ServiceSaveDto, req.body);
            }
            else {
                throw new OverallError("Invalid product type");
            }
            const errors = await validate(productSaveDto);
            const flattenErrors = errors.flat();
            if (flattenErrors.length > 0) {
                throw new FieldErrors(flattenErrors);
            }
            const product = await ProductService.saveProduct(productSaveDto);
            return res.json(product);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async deleteProduct(req, res, next) {
        try {
            const productId = Number(req.params.id);
            if (isNaN(productId)) {
                return res
                    .status(404)
                    .json(new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false));
            }
            await ProductService.deleteProduct(productId);
            return res.json(new ResponseDTO(null, null, true, "محصول با موفقیت حذف شد"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateProduct(req, res, next) {
        try {
            const productId = Number(req.params.id);
            if (isNaN(productId)) {
                return res
                    .status(404)
                    .json(new ResponseDTO({}, { message: "محصول مورد نظر یافت نشد" }, false));
            }
            const updateDto = plainToInstance(UpdateProductDto, req.body);
            const errors = await validate(updateDto);
            if (errors.length > 0) {
                throw new FieldErrors(errors);
            }
            const product = await ProductService.updateProduct(productId, updateDto);
            return res.json(new ResponseDTO(null, null, true, "محصول با موفقیت به‌روزرسانی شد", product));
        }
        catch (error) {
            console.error("Update product error:", error);
            next(error);
        }
    }
}
export default new ProductController();
