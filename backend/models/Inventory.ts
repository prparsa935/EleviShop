import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Product } from "./product.js";
export enum enumSize {
  sm = "کوچک",
  md = "متوسط",
  lg = "بزرگ",
}
@Entity()
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  quantity: number;
  @Column({ type: "enum", enum: enumSize })
  size: enumSize;
  @ManyToOne(() => Product)
  product: Relation<Product>;
}
enumSize.md;
