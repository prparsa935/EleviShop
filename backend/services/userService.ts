import { User } from "../models/User.js";
import dataSource from "../utils/dbConfiguration.js";

class UserService {
  private userRepo = dataSource.getRepository(User);

  async createUser(phoneNumber: string): Promise<User> {
    const user = new User();
    user.phoneNumber = phoneNumber;

    return await this.userRepo.save(user);
  }
  async findUserByPhoneNumber(phoneNumber: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        phoneNumber: phoneNumber,
      },
      relations:['person']
    });
    
  }
}
export default new UserService();
