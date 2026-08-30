import { Column, ChildEntity, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("productSet")
export class ProductSet extends Product {
  @Column()
  contain: string;
  @OneToMany(() => ProductSetItem, (item) => item.productSet)
  productSetItems: Relation<ProductSetItem>[];
}
