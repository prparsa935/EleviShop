// import { NextFunction, Request, Response } from "express";
// import ResponseDTO from "../dtos/response.dto";
// const checkAdminAuth = (req: Request, res: Response, next: NextFunction) => {
//   if (req["user"] === null) {
//     return res.status(403).json(new ResponseDTO({}, "لطفا وارد شوید"));
//   }
//   if (req["user"].isSuperUser === false) {
//     return res
//       .status(403)
//       .json(new ResponseDTO({}, "شما به این بخش دسترسی ندارید"));
//   }
//   next();
// };
// export default checkAdminAuth;
