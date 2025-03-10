import ResponseDTO from "../dtos/response.dto.js";
import CategoryService from "../services/categoryService.js";
class CategoryController {
    async findAllCategoryTree(req, res) {
        try {
            return res
                .status(200)
                .json(await CategoryService.buildCategoryTreeWithMap());
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
}
export default new CategoryController();
