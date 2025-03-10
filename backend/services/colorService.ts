import { EntityManager } from "typeorm";
import { Color } from "../models/Color.js";
import dataSource from "../utils/dbConfiguration.js";

class ColorService {
  private colorRepo = dataSource.getRepository(Color);
  async findColors(): Promise<Color[]> {
    return await this.colorRepo.find();
  }
  async findColorById(id: number): Promise<Color> {
    return await this.colorRepo.findOne({
      where: {
        id: id,
      },
    });
  }
  async saveColor(color: Color): Promise<Color> {
    return await this.colorRepo.save(color);
  }
}
export default new ColorService();
