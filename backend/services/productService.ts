import { promises } from "dns";
import { Product } from "../models/product";
import dataSource from "../utils/dbConfiguration";
import { Between, FindManyOptions, LessThan, Like, MoreThan } from "typeorm";
import { ProductFilter } from "../types/productTypes";
import { ProductSaveDto } from "../dtos/product.dto";
import { OverallError } from "../errors/orderSaveError";
import colorService from "./colorService";
import imageService from "./imageService";
import inventoryService from "./inventoryService";
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
        "color",
        "mainImage",
        "images",
        "mainCategory",
        "inventories",
      ],
    });
  }
  async findProductByName(name: string): Promise<Product> {
    return await this.productRepo.findOne({
      where: { name: name },
    });
  }
  async saveProduct(productSaveDto: ProductSaveDto): Promise<Product> {
    if (this.findProductByName(productSaveDto.productName)) {
      throw new OverallError("محصول با این نام وجود دارد", 400);
    }
    const selectedColor = await colorService.findColorById(
      productSaveDto.colorId
    );
    if (!selectedColor) {
      throw new OverallError("رنگ انتخاب شده نادرست است", 400);
    }

    const mainImage = await imageService.findImageById(
      productSaveDto.mainImageId
    );
    if (!mainImage) {
      throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
    }
    const images = await imageService.findImageByIds(productSaveDto.imageIds);
    return dataSource.transaction(async (entityManager) => {
      const inventories = await inventoryService.saveInventories(
        entityManager,
        productSaveDto.inventories
      );
      const product = new Product();
      product.code = productSaveDto.code;
      product.color = selectedColor;
      product.description = productSaveDto.description;
      product.height = productSaveDto.height;
      product.images = images;
      product.mainImage = mainImage;
      product.inventories = inventories;
      await entityManager.save(Product, product);

      return product;
    });
  }
  // async saveProduct(id: number): Promise<Product> {

  // }
}
export default new ProductService();
