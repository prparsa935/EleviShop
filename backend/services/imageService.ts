import { In } from "typeorm";
import { Image } from "../models/Image";
import dataSource from "../utils/dbConfiguration";

class ImageService {
  private imageRepo = dataSource.getRepository(Image);
  async saveImage(image: Image): Promise<Image> {
    return await this.imageRepo.save(image);
  }
  async findImageByIds(ids: number[]): Promise<Image[]> {
    return await this.imageRepo.find({
      where: {
        id: In(ids),
      },
    });
  }
  async findImageById(id: number): Promise<Image> {
    return await this.imageRepo.findOne({
      where: {
        id: id,
      },
    });
  }
}
export default new ImageService();
