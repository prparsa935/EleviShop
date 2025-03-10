import ResponseDTO from "../dtos/response.dto.js";
import ProductService from "../services/productService.js";
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
}
export default new ProductController();
