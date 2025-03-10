import { NextFunction, Request, Response } from "express";
import imageService from "../services/imageService.js";
import { Image } from "../models/Image.js";
import ResponseDTO from "../dtos/response.dto.js";

class ImageController {
  async saveimage(req: Request, res: Response, next: NextFunction) {
    try {
      const imageFile = req.file;
      const image = new Image();
      image.filePath = imageFile.filename;

      await imageService.saveImage(image);
      return res.json(
        new ResponseDTO({}, null, true, "عکس با موفقیت اپلود شد", {
          image: image,
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
export default new ImageController();
