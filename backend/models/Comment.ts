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
} from "typeorm";
import { Product } from "./product";
import { User } from "./User";

import { TfLogin } from "./TfLogin";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  content: String;
  @CreateDateColumn({ nullable: false })
  createdDate: Date;
  @UpdateDateColumn({ nullable: false })
  updateDate: Date;
  @ManyToOne(() => Product, (product) => product.comments, { nullable: false })
  product: Product;
  @ManyToOne(() => User, (user) => user.comments, { nullable: false })
  user: User;

  // @ManyToOne(()=>Comment,(comment)=>comment.comments)
  // comment:Comment
  // @OneToMany(()=>Comment,(comment)=>comment.comment)
  // comments:Comment[]
}
