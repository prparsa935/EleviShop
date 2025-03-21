import { Router } from "express";
import { body } from "express-validator";
import AuthController from "../controllers/authController.js";
import { fieldErrorHandler } from "../middlewares/errorHandler.js";
const authApi = Router();
authApi.post("/login", [
    body("phoneNumber")
        .isString()
        .matches("^09\\d{9}$")
        .withMessage("لطفا شماره همراه را درست وارد کنید"),
], fieldErrorHandler, AuthController.login);
authApi.post("/verify", [
    body("phoneNumber")
        .isString()
        .matches("^09\\d{9}$")
        .withMessage("لطفا شماره همراه را درست وارد کنید"),
    body("code")
        .isString()
        .isLength({ min: 6, max: 6 })
        .withMessage("لطفا کد را با فرمت درست وارد کنید"),
], fieldErrorHandler, AuthController.verify);
export default authApi;
