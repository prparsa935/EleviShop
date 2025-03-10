import { Comment } from "../models/Comment.js";
import dataSource from "../utils/dbConfiguration.js";
import { CommentOrders } from "../dtos/comment.dto.js";
import productService from "./productService.js";
import { OverallError } from "../errors/orderSaveError.js";
class CommentService {
    constructor() {
        this.commentRepo = dataSource.getRepository(Comment);
    }
    async findComments(productId, commentOrder, userId, pageNumber) {
        // const pagesize
        const pageSize = 10;
        // creating query
        const queryBuilder = await this.commentRepo
            .createQueryBuilder('comment')
            .leftJoinAndSelect("comment.product", "product")
            .leftJoinAndSelect("comment.user", "user")
            .leftJoinAndSelect("user.person", "profile")
            .where("comment.productId = :productId", { productId })
            .skip((pageNumber - 1) * pageSize)
            .take(pageSize)
            .select([
            "comment.id",
            "comment.content",
            "comment.likesCount",
            "comment.dislikesCount",
            "comment.dateCreated",
            "comment.rate",
            "user.id",
            "profile.firstName",
            "profile.lastName",
        ]);
        // if userlogin show does he like
        if (userId) {
            queryBuilder.leftJoinAndSelect("comment.likes", "likes", "likes.userId = :userId", {
                userId,
            });
            queryBuilder.addSelect(["likes.isLike"]);
        }
        // if ordering filter
        if (CommentOrders.best === commentOrder) {
            queryBuilder.orderBy("comment.likesCount", "DESC");
        }
        else if (CommentOrders.earliest === commentOrder) {
            queryBuilder.orderBy("comment.dateCreated", "DESC");
        }
        // fetch
        const comments = await queryBuilder.getMany();
        return comments;
    }
    async saveComment(commentSaveDto, productId, user) {
        const product = await productService.findProductById(productId);
        if (!product) {
            throw new OverallError("محصولی با این کد وجود ندارد", 404);
        }
        const newComment = new Comment();
        newComment.product = product;
        newComment.rate = commentSaveDto.rate;
        newComment.content = commentSaveDto.content;
        newComment.user = user;
        await this.commentRepo.save(newComment);
        return newComment;
    }
}
export default new CommentService();
