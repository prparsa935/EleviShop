import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  IntegerType,
  CreateDateColumn,
  UpdateDateColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
export class TfLogin {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, { nullable: false })
  user: Relation<User>;
  @Column()
  code: number;
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;
}
