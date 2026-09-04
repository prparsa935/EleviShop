import dataSource from "../utils/dbConfiguration.js";
import { Category } from "../models/Category.js";
import { Product } from "../models/product.js";
import { OverallError } from "../errors/orderSaveError.js";
class CategoryService {
    constructor() {
        this.categoryRepo = dataSource.getRepository(Category);
        this.productRepo = dataSource.getRepository(Product);
    }
    async buildCategoryTreeWithMap() {
        const categories = await this.categoryRepo.find({
            relations: ["parentCategory"],
        });
        const categoryMap = new Map();
        categories.forEach((category) => {
            category.childCategories = []; // Initialize children array
            categoryMap.set(category.id, category);
        });
        categories.forEach((category) => {
            if (category.parentCategory) {
                const parent = categoryMap.get(category.parentCategory.id);
                if (parent) {
                    parent.childCategories.push(category);
                }
            }
        });
        return [...categoryMap.values()].filter((cat) => !cat.parentCategory)[0]; // Return top-level categories
    }
    async findCategoryById(id) {
        return await this.categoryRepo.findOne({
            where: {
                id: id,
            },
            relations: ["parentCategory"],
        });
    }
    async createCategory(parentCatID, name) {
        const parentCat = await this.findCategoryById(parentCatID);
        const cat = new Category();
        cat.name = name;
        cat.parentCategory = parentCat;
        return await this.categoryRepo.save(cat);
    }
    async deleteCategory(id) {
        const category = await this.findCategoryById(id);
        if (!category) {
            throw new OverallError("دسته‌بندی مورد نظر یافت نشد", 404);
        }
        const childrenCount = await this.categoryRepo.count({
            where: { parentCategory: { id } },
        });
        if (childrenCount > 0) {
            throw new OverallError("امکان حذف وجود ندارد: این دسته‌بندی زیردسته دارد", 400);
        }
        const productsCount = await this.productRepo.count({
            where: { mainCategory: { id } },
        });
        if (productsCount > 0) {
            throw new OverallError("امکان حذف وجود ندارد: محصولی به این دسته‌بندی متصل است", 400);
        }
        await this.categoryRepo.remove(category);
    }
    async updateCategory(id, name, parentCatId) {
        const category = await this.findCategoryById(id);
        if (!category) {
            throw new OverallError("دسته‌بندی مورد نظر یافت نشد", 404);
        }
        if (name) {
            category.name = name;
        }
        if (parentCatId !== undefined && parentCatId !== null) {
            if (parentCatId === id) {
                throw new OverallError("دسته‌بندی نمی‌تواند والد خودش باشد", 400);
            }
            const parentCat = await this.findCategoryById(parentCatId);
            if (!parentCat) {
                throw new OverallError("دسته‌بندی والد یافت نشد", 404);
            }
            category.parentCategory = parentCat;
        }
        return await this.categoryRepo.save(category);
    }
}
export default new CategoryService();
