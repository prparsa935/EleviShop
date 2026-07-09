import dataSource from "../utils/dbConfiguration.js";

import { ProductFilter } from "../types/productTypes.js";
import { Category } from "../models/Category.js";
class CategoryService {
  private categoryRepo = dataSource.getRepository(Category);

  async buildCategoryTreeWithMap(): Promise<Category> {
    const categories = await this.categoryRepo.find({
      relations: ["parentCategory"],
    });
    const categoryMap = new Map<number, Category>();
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
  async findCategoryById(id: number): Promise<Category> {
    return await this.categoryRepo.findOne({
      where: {
        id: id,
      },
      relations: ["parentCategory"],
    });
  }
  async createCategory(parentCatID: number, name: string): Promise<Category> {
    const parentCat = await this.findCategoryById(parentCatID);
    const cat = new Category();
    cat.name = name;
    cat.parentCategory = parentCat;
    return await this.categoryRepo.save(cat);
  }
}
export default new CategoryService();
