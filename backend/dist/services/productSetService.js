import { ProductSet } from "../models/ProductSet.js";
import dataSource from "../utils/dbConfiguration.js";
class ProductSetService {
    constructor() {
        this.productSetRepo = dataSource.getRepository(ProductSet);
    }
    async findProductSetById(id) {
        return await this.productSetRepo.findOne({
            where: { id: id },
            relations: [
                "productSetItems",
                "productSetItems.plate",
                "productSetItems.plate.mainImage",
                "productSetItems.plate.inventories",
                "inventories",
                "mainImage",
            ],
        });
    }
}
export default new ProductSetService();
