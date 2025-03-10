import ResponseDTO from "../dtos/response.dto.js";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import commentService from "../services/commentService.js";
import { CommentSaveDto } from "../dtos/comment.dto.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
class CommentController {
    async findProductComments(req, res, next) {
        try {
            const user = req["user"];
            const productId = Number(req.params.productId);
            const commentOrder = String(req.query.commentOrder);
            const pageNumber = Number(req.query.pageNumber);
            if (isNaN(productId) && isNaN(pageNumber)) {
                throw new OverallError("خطای ورودی اشتباه", 404);
            }
            const comments = await commentService.findComments(productId, commentOrder, user ? user?.id : null, pageNumber);
            return res.status(200).json(comments);
        }
        catch (error) {
            next(error);
        }
    }
    async CreateProductComment(req, res, next) {
        try {
            const user = req["user"];
            const productId = Number(req.params.productId);
            if (isNaN(productId)) {
                throw new OverallError("محصول مورد نظر یافت نشد", 404);
            }
            const commentSaveDto = plainToInstance(CommentSaveDto, req.body);
            const errors = await validate(commentSaveDto);
            const flattenErrors = errors.flat();
            if (flattenErrors.length > 0) {
                throw new FieldErrors(flattenErrors);
            }
            await commentService.saveComment(commentSaveDto, productId, user);
            return res
                .status(200)
                .json(new ResponseDTO(null, null, true, "نظر شما با موفقیت ثبت شد"));
        }
        catch (error) {
            next(error);
        }
    }
}
export default new CommentController();
