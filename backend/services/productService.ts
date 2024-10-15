import { promises } from "dns";
import { Product } from "../models/product";
import dataSource from "../utils/dbConfiguration";
import { Between, FindManyOptions, LessThan, Like, MoreThan } from "typeorm";
import { ProductFilter } from "../types/productTypes";
class ProductService {
  private productRepo = dataSource.getRepository(Product);

  async findProductsByFillter(filter: ProductFilter): Promise<Product[]> {
    const pageSize = 10;
    const pageNumber = filter.pageNumber || 1;

    const options: FindManyOptions<Product> = {
      where: {},
      relations: ["mainImage"],
      skip: (pageNumber - 1) * pageSize, // Calculate how many records to skip
      take: pageSize,
    };
    if (filter.categoryId) {
      options.where["mainCategory"] = {};
      options.where["mainCategory"]["id"] = filter.categoryId;
    }
    if (filter.enableOff) {
      options.where["offPercent"] = Between(1, 99);
    }
    if (filter.name) {
      options.where["name"] = Like(`%${filter.name}%`);
    }
    if (filter.maxPrice && filter.minPrice) {
      options.where["price"] = Between(filter.minPrice, filter.maxPrice);
    }

    return await this.productRepo.find(options);
  }
  async findProductById(id: number): Promise<Product> {
    return await this.productRepo.findOne({
      where: { id: id },
      relations: [
        "comments",
        "color",
        "mainImage",
        "images",
        "mainCategory",
        "inventories",
      ],
    });
  }
  // async saveProduct(id: number): Promise<Product> {
    
  // }
}
export default new ProductService();
