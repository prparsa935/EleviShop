import { Service } from "../models/Service.js";
import dataSource from "../utils/dbConfiguration.js";

class ServiceService {
  private serviceRepo = dataSource.getRepository(Service);
  async findServiceById(id: number): Promise<Service> {
    return await this.serviceRepo.findOne({
      where: { id: id },
      relations: ["plates", "plates.mainImage", "mainImage"],
    });
  }
}
export default new ServiceService();
