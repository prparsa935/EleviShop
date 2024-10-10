import { Request, Response } from "express";

import ResponseDTO from "../dtos/response.dto";

import CategoryService from "../services/categoryService";

class CategoryController {
  async findAllCategoryTree(req: Request, res: Response) {
    try {
      return res.status(200).json(await CategoryService.buildCategoryTreeWithMap());
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO({}, "خطای درون سروری", false));
    }
  }
}
export default new CategoryController();
