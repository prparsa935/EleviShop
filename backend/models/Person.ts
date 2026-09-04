import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { User } from "./User.js";
import { Base } from "./Base.js";

@Entity()
export class Person extends Base {
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
  user: Relation<User>;
}
