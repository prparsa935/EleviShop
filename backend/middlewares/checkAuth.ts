import { NextFunction, Request, Response } from "express";
import { access } from "fs";
import { verify } from "jsonwebtoken";
import ResponseDTO from "../dtos/response.dto";

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  // const authToken=req.headers.authorization?.split(' ')[1] | null
  try {
    const authToken = req.cookies.access;

    if (authToken) {
      verify(authToken, process.env.SECRET_TOKEN_KEY, (err, user) => {
        if (err) {
          req["user"] = null;

          return res
            .status(403)
            .json(new ResponseDTO({}, "لطفا دوباره وارد شوید", false));
        } else {
          req["user"] = user;
          next();
        }
      });
    } else {
      return res.status(403).json(new ResponseDTO({}, "لطفا وارد شوید", false));
    }
  } catch (error) {
    return res
      .status(403)
      .json(new ResponseDTO({}, "خطای غیر منتظره در اعتبار سنجی کاربر", false));
  }
};
export default checkAuth;
