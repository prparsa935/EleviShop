import { ChildEntity, Column, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("plate")
export class Plate extends Product {
  @Column({ nullable: true })
  weight: number;
  @Column({ nullable: true })
  height: number;
  @Column({ nullable: true })
  width: number;
  @OneToMany(() => ProductSetItem, (item) => item.plate)
  productSetItems: Relation<ProductSetItem>[];
}
