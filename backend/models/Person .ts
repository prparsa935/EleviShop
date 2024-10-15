import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, nullable: false })
  firstName: string;
  @Column({ length: 20, nullable: false })
  lastName: string;
  @Column({ length: 12, nullable: false })
  phoneNumber: string;
  @Column({ nullable: false, length: 100 })
  addressLine: string;
  @Column({ length: 10, nullable: false })
  postalCode: string;

  @OneToOne(() => User, (user) => user.person)
  user: User;
}
