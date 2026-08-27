import ResponseDTO from "../dtos/response.dto.js";
import CategoryService from "../services/categoryService.js";
import { OverallError } from "../errors/orderSaveError.js";
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
    async createCategory(req, res, next) {
        try {
            const parentCatId = req.body.parentCatId;
            const categoryName = req.body.categoryname;
            if (!categoryName) {
                throw new OverallError("نام را وارد کنید");
            }
            await CategoryService.createCategory(parentCatId, categoryName);
            return res.json(new ResponseDTO(null, null, true, "کتگوری با موفقیت ایجاد شد"));
        }
        catch (error) {
            next(error);
        }
    }
    async findCategoryById(req, res, next) {
        try {
            const categoryId = Number(req.params.id);
            if (!categoryId) {
                throw new OverallError("کتگوری وجود ندارد");
            }
            const cat = await CategoryService.findCategoryById(categoryId);
            return res.json(cat);
        }
        catch (error) {
            next(error);
        }
    }
    async deleteCategory(req, res, next) {
        try {
            const categoryId = Number(req.params.id);
            if (!categoryId) {
                throw new OverallError("دسته‌بندی مورد نظر یافت نشد", 404);
            }
            await CategoryService.deleteCategory(categoryId);
            return res.json(new ResponseDTO(null, null, true, "دسته‌بندی با موفقیت حذف شد"));
        }
        catch (error) {
            next(error);
        }
    }
    async updateCategory(req, res, next) {
        try {
            const categoryId = Number(req.params.id);
            if (!categoryId) {
                throw new OverallError("دسته‌بندی مورد نظر یافت نشد", 404);
            }
            const { categoryname, parentCatId } = req.body;
            if (!categoryname) {
                throw new OverallError("نام را وارد کنید");
            }
            const category = await CategoryService.updateCategory(categoryId, categoryname, parentCatId);
            return res.json(new ResponseDTO(null, null, true, "دسته‌بندی با موفقیت به‌روزرسانی شد", category));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new CategoryController();
