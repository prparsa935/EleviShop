import { User } from "../models/User";

import jsonwebtoken = require("jsonwebtoken");
class AuthService {
  // private tfLogin = dataSource.getRepository(TfLogin);

  private verificationCodes: Record<string, string> = {}; // Store verification codes

  storeVerificationCode(phoneNumber: string, code: string) {
    this.verificationCodes[phoneNumber] = code;
  }
  tokenUser(user: User) {
    const userToken = jsonwebtoken.sign(
      {
        id: user.id,
        phoneNumber: user.phoneNumber,
      },
      process.env.SECRET_TOKEN_KEY
    );
    return userToken;
  }
  verifyCode(phoneNumber: string, code: string): boolean {
    return this.verificationCodes[phoneNumber] === code;
  }
  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
  }
  async sendVerificationCode(phoneNumber: string, code: string): Promise<void> {
    // await this.twilioClient.messages.create({
    //   body: `Your verification code is: ${code}`,
    //   from: this.twilioPhoneNumber,
    //   to: phoneNumber,
    // });
  }
  verifyToken = (access: string): Partial<User> => {
    if (access == null) return null;
    let user: Partial<User> = null;

    jsonwebtoken.verify(
      access,
      process.env.SECRET_TOKEN_KEY,
      (err, iuser: Partial<User>) => {
        if (err) return null;
        console.log(iuser);
        user = iuser;
      }
    );

    return user;
  };
}
export default new AuthService();
