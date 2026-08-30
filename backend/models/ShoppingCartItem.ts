import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  Unique,
} from "typeorm";
import { User } from "./User.js";
import { Base } from "./Base.js";
import { Inventory } from "./Inventory.js";
import { ProductSet } from "./ProductSet.js";
import { Color } from "./Color.js";

export enum CartItemType {
  SIMPLE = "SIMPLE",
  SET = "SET",
}

@Unique(["user", "inventory"])
@Unique(["user", "productSet", "color"])
@Entity()
export class ShoppingCartItem extends Base {
  @ManyToOne(() => User, (user) => user.shoppingCartItems)
  user: Relation<User>;
  @ManyToOne(() => Inventory, { nullable: true })
  inventory: Relation<Inventory>;
  @Column()
  count: number;
  @Column({
    type: "enum",
    enum: CartItemType,
    default: CartItemType.SIMPLE,
  })
  itemType: CartItemType;
  @ManyToOne(() => ProductSet, { nullable: true })
  productSet: Relation<ProductSet>;
  @ManyToOne(() => Color, { nullable: true })
  color: Relation<Color>;
}
