import { Service } from "../models/Service.js";
import dataSource from "../utils/dbConfiguration.js";
class ServiceService {
    constructor() {
        this.serviceRepo = dataSource.getRepository(Service);
    }
    async findServiceById(id) {
        return await this.serviceRepo.findOne({
            where: { id: id },
            relations: [
                "plates",
                "plates.mainImage",
                "plates.inventories",
                "inventories",
                "mainImage",
            ],
        });
    }
}
export default new ServiceService();
