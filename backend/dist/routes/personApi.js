import { Router } from "express";
import personController from "../controllers/personController.js";
import authController from "../controllers/authController.js";
const personApi = Router();
// check user with identify
personApi.use(authController.authorizeUser);
personApi.post("/save", personController.savePerson);
personApi.get("", personController.findPersonByUser);
export default personApi;
