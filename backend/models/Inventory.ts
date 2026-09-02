import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from "typeorm";
import { Product } from "./product.js";
import { Color } from "./Color.js";
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
  @ManyToOne(() => Product)
  product: Relation<Product>;
  @Column({ nullable: false })
  price: number;
  @Column({ type: "int", nullable: true, default: null })
  colorId: number | null;
  @ManyToOne(() => Color, { nullable: true })
  @JoinColumn({ name: "colorId" })
  color: Relation<Color>;
  @Column({ default: 5 })
  lowStockThreshold: number;
}
enumSize.md;
