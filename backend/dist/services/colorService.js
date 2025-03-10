import { Color } from "../models/Color.js";
import dataSource from "../utils/dbConfiguration.js";
class ColorService {
    constructor() {
        this.colorRepo = dataSource.getRepository(Color);
    }
    async findColors() {
        return await this.colorRepo.find();
    }
    async findColorById(id) {
        return await this.colorRepo.findOne({
            where: {
                id: id,
            },
        });
    }
    async saveColor(color) {
        return await this.colorRepo.save(color);
    }
}
export default new ColorService();
