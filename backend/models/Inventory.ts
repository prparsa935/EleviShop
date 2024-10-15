import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product";
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
  product: Product;
}
enumSize.md
