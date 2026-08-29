import {
  Entity,
  Column,
  ManyToOne,
  Relation,
} from "typeorm";
import { Inventory } from "./Inventory.js";
import { User } from "./User.js";
import { Base } from "./Base.js";

export enum MovementType {
  SALE = "SALE",
  RETURN = "RETURN",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
  RESTOCK = "RESTOCK",
  BUNDLE_SALE = "BUNDLE_SALE",
}

@Entity()
export class StockMovement extends Base {
  @ManyToOne(() => Inventory, { nullable: false })
  inventory: Relation<Inventory>;

  @Column({ type: "enum", enum: MovementType, nullable: false })
  type: MovementType;

  @Column({ nullable: false })
  quantityChange: number;

  @Column({ nullable: false })
  quantityAfter: number;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => User, { nullable: true })
  performedBy: Relation<User>;
}

