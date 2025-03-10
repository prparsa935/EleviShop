import { In } from "typeorm";
import { Image } from "../models/Image.js";
import dataSource from "../utils/dbConfiguration.js";
class ImageService {
    constructor() {
        this.imageRepo = dataSource.getRepository(Image);
    }
    async saveImage(image) {
        return await this.imageRepo.save(image);
    }
    async findImageByIds(ids) {
        return await this.imageRepo.find({
            where: {
                id: In(ids),
            },
        });
    }
    async findImageById(id) {
        return await this.imageRepo.findOne({
            where: {
                id: id,
            },
        });
    }
}
export default new ImageService();
