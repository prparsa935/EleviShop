import { Product } from "../models/product.js";
import dataSource from "../utils/dbConfiguration.js";
import { Between, FindManyOptions, Like } from "typeorm";
import { ProductFilter } from "../types/productTypes.js";
// import { ProductSaveDto } from "../dtos/product.dto.js";
import { OverallError } from "../errors/orderSaveError.js";
import imageService from "./imageService.js";
// import serviceService from "./serviceService.js";
import { Plate } from "../models/plate.js";
import { Service } from "../models/Service.js";
import inventoryService from "./inventoryService.js";
import {
  PlateSaveDto,
  ProductSaveDto,
  ServiceSaveDto,
} from "../dtos/product.dto.js";
import { Inventory } from "../models/Inventory.js";
import plateService from "./plateService.js";

class ProductService {
  private productRepo = dataSource.getRepository(Product);

  async findProductsByFillter(filter: ProductFilter): Promise<Product[]> {
    const pageSize = 10;
    const pageNumber = filter.pageNumber || 1;
    // ایجاد query builder برای کنترل بهتر روی joinها
    const query = this.productRepo
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.mainImage", "mainImage")
      .leftJoinAndSelect("product.inventories", "inventory")
      .skip((pageNumber - 1) * pageSize)
      .take(pageSize);

    if (filter.categoryId) {
      query.andWhere("product.mainCategoryId = :categoryId", {
        categoryId: filter.categoryId,
      });
    }

    if (filter.enableOff === "true") {
      console.log("here");
      query.andWhere("product.offPercent BETWEEN 1 AND 99");
    }

    if (filter.name) {
      query.andWhere("product.name LIKE :name", {
        name: `%${filter.name}%`,
      });
    }

    if (filter.minPrice && filter.maxPrice) {
      query.andWhere("inventory.price BETWEEN :minPrice AND :maxPrice", {
        minPrice: filter.minPrice,
        maxPrice: filter.maxPrice,
      });
    }

    return await query.getMany();
  }
  async findProductById(id: number): Promise<Product> {
    return await this.productRepo.findOne({
      where: { id: id },
      relations: [
        "mainImage",
        "images",
        "mainCategory",
        "inventories",
        "service",
      ],
    });
  }

  async findProductByName(name: string): Promise<Product> {
    return await this.productRepo.findOne({
      where: { name: name },
    });
  }
  async saveProduct(
    productSaveDto: PlateSaveDto | ServiceSaveDto
  ): Promise<Product> {
    // 1. Validate product name uniqueness
    if (await this.findProductByName(productSaveDto.productName)) {
      throw new OverallError("محصول با این نام وجود دارد", 400);
    }

    // 2. Validate and fetch images in parallel for better performance
    const [mainImage, images] = await Promise.all([
      imageService.findImageById(productSaveDto.mainImageId),
      imageService.findImageByIds(productSaveDto.imageIds),
    ]);

    if (!mainImage) {
      throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
    }

    // 3. Create inventories
    const inventories = productSaveDto.inventories.map((inventoryDto) => {
      const inventory = new Inventory();
      Object.assign(inventory, {
        price: inventoryDto.price,
        quantity: inventoryDto.quantity,
      });
      return inventory;
    });

    // 4. Use transaction for atomic operations
    return dataSource.transaction(async (entityManager) => {
      // 5. Save inventories first
      await inventoryService.saveInventories(entityManager, inventories);

      // 6. Create product based on type with proper type safety
      let product: Product;
      if (productSaveDto.type === "plate") {
        const plateDto = productSaveDto as PlateSaveDto;
        const plate = new Plate();
        Object.assign(plate, {
          width: plateDto.width,
          weight: plateDto.weight,
          height: plateDto.height,
        });
        product = plate;
      } else {
        const serviceDto = productSaveDto as ServiceSaveDto;
        const service = new Service();
        const plates = await plateService.findProductByIds(serviceDto.plateIds);
        Object.assign(service, {
          contain: serviceDto.contain,
          plates: plates, // Assuming you want to assign plates here
        });
        product = service;
      }

      // 7. Assign common properties

      Object.assign(product, {
        material: productSaveDto.material,
        name: productSaveDto.productName,
        pattern: productSaveDto.pattern,
        code: productSaveDto.code,
        description: productSaveDto.description,
        offPercent: productSaveDto.offPercent,
        images,
        mainImage,
        inventories,
        type: productSaveDto.type,
        productName: productSaveDto.productName, // Assuming this should be included
      });

      // 8. Save and return the product
      return await entityManager.save(Product, product);
    });
  }
}
export default new ProductService();
