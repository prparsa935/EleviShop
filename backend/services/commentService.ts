import { Comment } from "../models/Comment.js";
import dataSource from "../utils/dbConfiguration.js";
import { CommentOrders, CommentSaveDto } from "../dtos/comment.dto.js";
import productService from "./productService.js";
import { OverallError } from "../errors/orderSaveError.js";
import { User } from "../models/User.js";
class CommentService {
  private commentRepo = dataSource.getRepository(Comment);
  async findComments(
    productId: number,
    commentOrder: string,
    userId: number,
    pageNumber: number
  ): Promise<Comment[]> {
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
      queryBuilder.leftJoinAndSelect(
        "comment.likes",
        "likes",
        "likes.userId = :userId",
        {
          userId,
        }
      );
      queryBuilder.addSelect(["likes.isLike"]);
    }
    // if ordering filter
    if (CommentOrders.best === commentOrder) {
      queryBuilder.orderBy("comment.likesCount", "DESC");
    } else if (CommentOrders.earliest === commentOrder) {
      queryBuilder.orderBy("comment.dateCreated", "DESC");
    }
  
    // fetch
    const comments = await queryBuilder.getMany();

    return comments;
  }
  async saveComment(
    commentSaveDto: CommentSaveDto,
    productId: number,
    user: User
  ): Promise<Comment> {
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
