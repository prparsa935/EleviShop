import ResponseDTO from "../dtos/response.dto.js";
import { FieldErrors, OverallError } from "../errors/orderSaveError.js";
import commentService from "../services/commentService.js";
import { CommentLikeDto, CommentSaveDto } from "../dtos/comment.dto.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
class CommentController {
    async findProductComments(req, res, next) {
        try {
            const user = req["user"];
            const productId = Number(req.params.productId);
            if (isNaN(productId)) {
                throw new OverallError("محصول مورد نظر یافت نشد", 404);
            }
            const commentOrder = String(req.query.commentOrder ?? "");
            const pageNumber = Number(req.query.pageNumber ?? 1);
            const comments = await commentService.findComments(productId, commentOrder, user ? user?.id : null, pageNumber);
            return res.status(200).json(comments);
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }
    async getProductCommentStats(req, res, next) {
        try {
            const productId = Number(req.params.productId);
            if (isNaN(productId)) {
                throw new OverallError("محصول مورد نظر یافت نشد", 404);
            }
            const stats = await commentService.getProductCommentStats(productId);
            return res.status(200).json(stats);
        }
        catch (error) {
            next(error);
        }
    }
    async setCommentReaction(req, res, next) {
        try {
            const user = req["user"];
            const commentId = Number(req.params.commentId);
            if (isNaN(commentId)) {
                throw new OverallError("دیدگاه مورد نظر یافت نشد", 404);
            }
            const likeDto = plainToInstance(CommentLikeDto, req.body);
            const errors = await validate(likeDto);
            if (errors.length > 0) {
                throw new FieldErrors(errors);
            }
            const result = await commentService.setCommentReaction(commentId, user, likeDto.isLike);
            return res.status(200).json(new ResponseDTO(null, null, true, null, result));
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
