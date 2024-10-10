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
} from "typeorm";
import { User } from "./User";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
export class TfLogin {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToOne(() => User, { nullable: false })
  user: User;
  @Column()
  code: number;
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;
}
