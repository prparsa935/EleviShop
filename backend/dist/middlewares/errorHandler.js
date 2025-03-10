import { validationResult } from "express-validator";
import ResponseDTO from "../dtos/response.dto.js";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
const fieldErrorHandler = (req, res, next) => {
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
    }
    else {
        next();
    }
};
const overallErrorHandler = (error, req, res, next) => {
    if (error instanceof OverallError) {
        return res
            .status(error.statusCode)
            .json(new ResponseDTO(null, { message: error.message }, false));
    }
    else if (error instanceof FieldErrors) {
        const fieldErrors = {};
        error.validationErrors.forEach((error) => {
            fieldErrors[error.property] = Object.values(error.constraints)[0];
        });
        return res.status(400).json(new ResponseDTO(fieldErrors, null, false));
    }
    else {
        return res
            .status(500)
            .json(new ResponseDTO(null, { message: "خطا داخلی سرور" }, false));
    }
};
export { fieldErrorHandler, overallErrorHandler };
