import { Entity, Column, OneToMany, ManyToOne, Relation } from "typeorm";
import { Product } from "./product.js";
import { User } from "./User.js";
import { UserCommentLikes } from "./UserCommentLikes.js";
import { Base } from "./Base.js";

@Entity()
export class Comment extends Base {
  @Column({ nullable: false })
  content: String;
  @Column({ nullable: false })
  rate: number;
  @Column({ default: 0 })
  likesCount: number;
  @Column({ default: 0 })
  dislikesCount: number;

  @ManyToOne(() => Product, { nullable: false })
  product: Relation<Product>;
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  user: Relation<User>;
  @OneToMany(
    () => UserCommentLikes,
    (userCommentLikes) => userCommentLikes.comment
  )
  likes: UserCommentLikes[];

  // @ManyToOne(()=>Comment,(comment)=>comment.comments)
  // comment:Comment
  // @OneToMany(()=>Comment,(comment)=>comment.comment)
  // comments:Comment[]
}
