import { Request, Response } from "express";
import ResponseDTO from "../dtos/response.dto";
import authService from "../services/authService";
import userService from "../services/userService";

class AuthController {
  constructor() {}
  async login(req: Request, res: Response) {
    try {
      const phoneNumber: string = req.body;
      const code: string = authService.generateVerificationCode();
      console.log(code);
      // authService.sendVerificationCode(phoneNumber, code)
      authService.storeVerificationCode(phoneNumber, code);

      return res.status(200);
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json(new ResponseDTO({}, "خطای درون سروری", false));
    }
  }

  async verify(req: Request, res: Response) {
    try {
      const phonenumber: string = req.body.phoneNumber;
      const code: string = req.body.code;
      if (authService.verifyCode(phonenumber, code)) {
        const user = await userService.createUser(phonenumber);
        const userToken = authService.tokenUser(user);

        return res
          .status(200)
          .json(
            new ResponseDTO({}, null, true, "با موفقیت وارد شدید", userToken)
          );
      }
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, "خطای درون سروری", false));
    }
  }
}
export default new AuthController();
