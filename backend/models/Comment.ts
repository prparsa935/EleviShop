import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  IntegerType,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { Product } from "./product.js";
import { User } from "./User.js";
import { UserCommentLikes } from "./UserCommentLikes.js";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  content: String;
  @Column({ nullable: false })
  rate: number;
  @Column({ default: 0 })
  likesCount: number;
  @Column({ default: 0 })
  dislikesCount: number;
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  dateCreated: Date;
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;
  @ManyToOne(() => Product, (product) => product.comments, { nullable: false })
  product: Relation<Product>;
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  user: User;
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
