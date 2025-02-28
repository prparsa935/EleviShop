import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Comment } from "./Comment";

@Entity()
export class UserCommentLikes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Comment,(comment)=>comment.likes)
  comment: Comment;

  @Column()
  isLike: boolean; // true = like, false = dislike
}