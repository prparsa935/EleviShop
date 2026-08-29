import { NextFunction, Request, Response } from "express";
import ResponseDTO from "../dtos/response.dto.js";
import shoppingCartService from "../services/shoppingCartService.js";
import { User } from "../models/User.js";

class ShoppingCartController {
  async getShoppingCart(req: Request, res: Response) {
    try {
      const user: User = req["user"];
      return res
        .status(200)
        .json(await shoppingCartService.getUserCart(user.id));
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
    }
  }

  async syncShoppingCart(req: Request, res: Response, next: NextFunction) {
    try {
      const user: User = req["user"];
      const items = req.body?.items;
      if (!Array.isArray(items)) {
        return res
          .status(400)
          .json(
            new ResponseDTO(
              {},
              { message: "آیتم‌های سبد خرید ارسال نشده‌اند" },
              false
            )
          );
      }
      const replace = req.body?.replace === true;
      return res
        .status(200)
        .json(await shoppingCartService.syncShoppingCart(user, items, replace));
    } catch (error) {
      next(error);
    }
  }
}
export default new ShoppingCartController();
