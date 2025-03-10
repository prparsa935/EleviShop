import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";
import { Comment } from "./Comment.js";

@Entity()
export class UserCommentLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Relation<Comment>;

  @Column()
  isLike: boolean; // true = like, false = dislike
}
