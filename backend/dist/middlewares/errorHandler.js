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
        // nested validators (items / inventories) leave the parent error without
        // constraints, so walk the children and report under the root property —
        // Object.values on the bare parent used to throw here and turn the whole
        // request into a content-less 500
        const fieldErrors = {};
        const flatten = (errs, parent) => {
            errs.forEach((err) => {
                const property = parent ? `${parent}.${err.property}` : err.property;
                if (err.constraints) {
                    const root = property.split(".")[0];
                    if (!fieldErrors[root]) {
                        fieldErrors[root] = Object.values(err.constraints)[0];
                    }
                }
                if (err.children && err.children.length > 0) {
                    flatten(err.children, property);
                }
            });
        };
        flatten(error.validationErrors);
        // a failing parent may carry no constraints and message-less children
        error.validationErrors.forEach((err) => {
            if (!fieldErrors[err.property]) {
                fieldErrors[err.property] = "مقدار وارد شده معتبر نیست";
            }
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
