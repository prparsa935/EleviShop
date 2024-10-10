import { NextFunction, Request, Response } from "express";
import { validationResult, ResultFactory } from "express-validator";
import ResponseDTO from "../dtos/response.dto";
const fieldErrorHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  const fieldErrors = {};

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      switch (error.type) {
        case "field":
          // this is a FieldValidationError
          fieldErrors[error.path] = error.msg;
      }
    });
    return res.status(400).json(new ResponseDTO(fieldErrors, null, false));
  } else {
    next();
  }
};
export {fieldErrorHandler}
