import dataSource from "../utils/dbConfiguration.js";
import { In } from "typeorm";
import { Plate } from "../models/plate.js";
class PlateService {
    constructor() {
        this.plateRepo = dataSource.getRepository(Plate);
    }
    async findProductById(id) {
        return await this.plateRepo.findOne({
            where: { id: id },
            relations: [
                "mainImage",
                "images",
                "mainCategory",
                "inventories",
                "plateSetItems",
                "plateSetItems.productSet",
            ],
        });
    }
    async findProductByIds(ids) {
        return await this.plateRepo.find({
            where: { id: In(ids) },
        });
    }
}
export default new PlateService();
