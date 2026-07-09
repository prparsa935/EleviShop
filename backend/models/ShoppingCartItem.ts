import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from "typeorm";
import { Product } from "./product.js";
import { User } from "./User.js";
import { Base } from "./Base.js";
import { Inventory } from "./Inventory.js";
@Unique(["user", "inventory"])
@Entity()
export class ShoppingCartItem extends Base {
  @ManyToOne(() => User, (user) => user.shoppingCartItems)
  user: Relation<User>;
  @ManyToOne(() => Inventory)
  inventory: Relation<Inventory>;
  @Column()
  count: number;
}
