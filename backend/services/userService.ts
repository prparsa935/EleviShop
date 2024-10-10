import { User } from "../models/User";
import dataSource from "../utils/dbConfiguration";

class UserService {
  private userRepo = dataSource.getRepository(User);

  async createUser(phoneNumber: string): Promise<User> {
    const user = new User();
    user.phoneNumber = phoneNumber;

    return await this.userRepo.save(user);
  }
}
export default new UserService();
