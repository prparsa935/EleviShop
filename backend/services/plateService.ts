import { Product } from "../models/product.js";
import dataSource from "../utils/dbConfiguration.js";
import { Between, FindManyOptions, In, Like } from "typeorm";
import { ProductFilter } from "../types/productTypes.js";
// import { ProductSaveDto } from "../dtos/product.dto.js";
import { OverallError } from "../errors/orderSaveError.js";
import imageService from "./imageService.js";
// import serviceService from "./serviceService.js";
import { Plate } from "../models/plate.js";
import { Service } from "../models/Service.js";
import inventoryService from "./inventoryService.js";

class PlateService {
  private plateRepo = dataSource.getRepository(Plate);

  async findProductById(id: number): Promise<Product> {
    return await this.plateRepo.findOne({
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
  async findProductByIds(ids: number[]): Promise<Product[]> {
    return await this.plateRepo.find({
      where: { id: In(ids)  },

    });
  }

//   async saveProduct(productSaveDto: ProductSaveDto): Promise<Product> {
//     if (this.findProductByName(productSaveDto.productName)) {
//       throw new OverallError("محصول با این نام وجود دارد", 400);
//     }

//     const mainImage = await imageService.findImageById(
//       productSaveDto.mainImageId
//     );
//     if (!mainImage) {
//       throw new OverallError("عکس اصلی در پایگاه داده پیدا نشد", 404);
//     }
//     const images = await imageService.findImageByIds(productSaveDto.imageIds);
//     return dataSource.transaction(async (entityManager) => {
//       const inventory = await inventoryService.saveInventories(
//         entityManager,
//         productSaveDto.inventory
//       );

//       if (productSaveDto.type === "plate") {
//         const product = new Plate();
//         product.code = productSaveDto.code;
//         product.description = productSaveDto.description;
//         product.images = images;
//         product.mainImage = mainImage;
//         product.inventory = ;
//         await entityManager.save(Product, product);
//       } else {
//         const product = new Service();
//         product.code = productSaveDto.code;
//         product.description = productSaveDto.description;
//         product.images = images;
//         product.mainImage = mainImage;
//         product.inventories = inventories;
//         product.type = productSaveDto.type;
//         product.inventory=product.

//         await entityManager.save(Product, product);
//       }

//       return product;
//     });
//   }
}
export default new PlateService();
