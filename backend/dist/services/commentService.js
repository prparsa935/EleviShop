import { Comment } from "../models/Comment.js";
import dataSource from "../utils/dbConfiguration.js";
import { CommentOrders } from "../dtos/comment.dto.js";
import productService from "./productService.js";
import { OverallError } from "../errors/orderSaveError.js";
import { UserCommentLikes } from "../models/UserCommentLikes.js";
import { Order, orderStatus } from "../models/Order.js";
const COMMENTS_PAGE_SIZE = 10;
class CommentService {
    constructor() {
        this.commentRepo = dataSource.getRepository(Comment);
        this.commentLikeRepo = dataSource.getRepository(UserCommentLikes);
    }
    async findComments(productId, commentOrder, userId, pageNumber) {
        const safePage = Number.isFinite(pageNumber) && pageNumber > 0 ? Math.floor(pageNumber) : 1;
        const queryBuilder = await this.commentRepo
            .createQueryBuilder("comment")
            .leftJoinAndSelect("comment.user", "user")
            .leftJoinAndSelect("user.person", "profile")
            .where("comment.productId = :productId", { productId })
            .skip((safePage - 1) * COMMENTS_PAGE_SIZE)
            .take(COMMENTS_PAGE_SIZE)
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
        // if user login show does he like
        if (userId) {
            queryBuilder.leftJoinAndSelect("comment.likes", "likes", "likes.userId = :userId", {
                userId,
            });
            queryBuilder.addSelect(["likes.isLike"]);
        }
        // if ordering filter
        if (CommentOrders.best === commentOrder) {
            queryBuilder.orderBy("comment.likesCount", "DESC");
            queryBuilder.addOrderBy("comment.dateCreated", "DESC");
        }
        else {
            queryBuilder.orderBy("comment.dateCreated", "DESC");
        }
        // fetch
        const comments = await queryBuilder.getMany();
        // mark comments of users who bought this product (buyer tag)
        if (comments.length > 0) {
            const buyerUserIds = await this.findBuyerUserIds(productId);
            for (const comment of comments) {
                comment["isBuyer"] = buyerUserIds.has(comment.user?.id);
            }
        }
        return comments;
    }
    // users whose delivered/paid orders contain this product
    async findBuyerUserIds(productId) {
        const rows = await dataSource
            .getRepository(Order)
            .createQueryBuilder("order")
            .innerJoin("order.orderInventories", "orderInventory")
            .innerJoin("orderInventory.inventory", "inventory")
            .where("inventory.productId = :productId", { productId })
            .andWhere("order.orderStatus IN (:...statuses)", {
            statuses: [
                orderStatus.delivered,
                orderStatus.successfulPayOrValidated,
                orderStatus.waitingFordelivery,
            ],
        })
            .select("DISTINCT order.userId", "userId")
            .getRawMany();
        return new Set(rows.map((row) => Number(row.userId)));
    }
    async getProductCommentStats(productId) {
        const result = await this.commentRepo
            .createQueryBuilder("comment")
            .where("comment.productId = :productId", { productId })
            .select("COUNT(comment.id)", "commentsCount")
            .addSelect("COALESCE(AVG(comment.rate), 0)", "averageRate")
            .getRawOne();
        return {
            commentsCount: Number(result?.commentsCount ?? 0),
            averageRate: Math.round(Number(result?.averageRate ?? 0) * 10) / 10,
        };
    }
    async setCommentReaction(commentId, user, isLike) {
        const comment = await this.commentRepo.findOne({ where: { id: commentId } });
        if (!comment) {
            throw new OverallError("دیدگاه مورد نظر یافت نشد", 404);
        }
        const existing = await this.commentLikeRepo.findOne({
            where: { comment: { id: commentId }, user: { id: user.id } },
        });
        if (existing && existing.isLike === isLike) {
            // clicking the same reaction again removes it
            await this.commentLikeRepo.remove(existing);
        }
        else if (existing) {
            existing.isLike = isLike;
            await this.commentLikeRepo.save(existing);
        }
        else {
            const like = new UserCommentLikes();
            like.comment = comment;
            like.user = user;
            like.isLike = isLike;
            await this.commentLikeRepo.save(like);
        }
        // recount from the source of truth instead of manual increments
        const likesCount = await this.commentLikeRepo.count({
            where: { comment: { id: commentId }, isLike: true },
        });
        const dislikesCount = await this.commentLikeRepo.count({
            where: { comment: { id: commentId }, isLike: false },
        });
        comment.likesCount = likesCount;
        comment.dislikesCount = dislikesCount;
        await this.commentRepo.save(comment);
        const myReactionRow = await this.commentLikeRepo.findOne({
            where: { comment: { id: commentId }, user: { id: user.id } },
        });
        return {
            likesCount,
            dislikesCount,
            myReaction: myReactionRow ? myReactionRow.isLike : null,
        };
    }
    async saveComment(commentSaveDto, productId, user) {
        const product = await productService.findProductById(productId);
        if (!product) {
            throw new OverallError("محصولی با این کد وجود ندارد", 404);
        }
        const newComment = new Comment();
        newComment.product = product;
        newComment.rate = commentSaveDto.rate;
        newComment.content = commentSaveDto.content.trim();
        newComment.user = user;
        await this.commentRepo.save(newComment);
        return newComment;
    }
}
export default new CommentService();
