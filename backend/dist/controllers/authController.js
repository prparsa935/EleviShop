import ResponseDTO from "../dtos/response.dto.js";
import authService from "../services/authService.js";
import userService from "../services/userService.js";
class AuthController {
    constructor() { }
    async login(req, res) {
        try {
            const phoneNumber = req.body.phoneNumber;
            const code = authService.generateVerificationCode();
            console.log(code);
            // authService.sendVerificationCode(phoneNumber, code)
            authService.storeVerificationCode(phoneNumber, code);
            return res.status(200).json();
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async verify(req, res) {
        try {
            const phonenumber = req.body.phoneNumber;
            const code = req.body.code;
            if (authService.verifyCode(phonenumber, code)) {
                let userToken = "";
                const existingUser = await userService.findUserByPhoneNumber(phonenumber);
                if (existingUser) {
                    userToken = authService.tokenUser(existingUser);
                }
                else {
                    const user = await userService.createUser(phonenumber);
                    userToken = authService.tokenUser(user);
                }
                return res
                    .status(200)
                    .json(new ResponseDTO({}, null, true, "با موفقیت وارد شدید", userToken));
            }
            else {
                return res
                    .status(400)
                    .json(new ResponseDTO({}, { message: "کد وارد شده اشتباه است" }, false));
            }
        }
        catch (error) {
            return res
                .status(500)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async authorizeUser(req, res, next) {
        try {
            const accessToken = req.headers.authorization.split(" ")[1];
            const user = authService.verifyToken(accessToken);
            if (!user)
                return res
                    .status(403)
                    .json(new ResponseDTO({}, { message: "لطفا وارد اکانت خود شوید" }));
            const fullUser = await userService.findUserByPhoneNumber(user.phoneNumber);
            if (!fullUser)
                return res
                    .status(403)
                    .json(new ResponseDTO({}, { message: "لطفا دوباره وارد اکانت خود شوید" }));
            req["user"] = fullUser;
            next();
        }
        catch (error) {
            return res
                .status(403)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async authorizeUserWithoutErr(req, res, next) {
        try {
            const accessToken = req.headers.authorization.split(" ")[1];
            const user = authService.verifyToken(accessToken);
            // todo need test
            if (!user)
                return next();
            const fullUser = await userService.findUserByPhoneNumber(user.phoneNumber);
            if (!fullUser)
                return next();
            req["user"] = fullUser;
            next();
        }
        catch (error) {
            return res
                .status(403)
                .json(new ResponseDTO({}, { message: "خطای درون سروری" }, false));
        }
    }
    async isAdmin(req, res, next) {
        try {
            const user = req["user"];
            if (!user.isSuperUser) {
                return res
                    .status(403)
                    .json(new ResponseDTO({}, { message: "خطای عدم دسترسی" }));
            }
            next();
        }
        catch (error) {
            return res
                .status(403)
                .json(new ResponseDTO({}, { message: "خظای غیر منتظره در اعتبار سنجی" }));
        }
    }
    async isIdentified(req, res, next) {
        try {
            const user = req["user"];
            if (!user.isIdentified) {
                return res
                    .status(403)
                    .json(new ResponseDTO({}, { message: "خطای عدم دسترسی" }));
            }
            next();
        }
        catch (error) {
            return res
                .status(403)
                .json(new ResponseDTO({}, { message: "خظای غیر منتظره در اعتبار سنجی" }));
        }
    }
}
export default new AuthController();
