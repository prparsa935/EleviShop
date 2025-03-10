import dataSource from "../utils/dbConfiguration.js";
import { Category } from "../models/Category.js";
class CategoryService {
    constructor() {
        this.categoryRepo = dataSource.getRepository(Category);
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
}
export default new CategoryService();
