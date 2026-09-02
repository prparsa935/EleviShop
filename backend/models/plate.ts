import { ChildEntity, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("plate")
export class Plate extends Product {
  @OneToMany(() => ProductSetItem, (item) => item.plate)
  productSetItems: Relation<ProductSetItem>[];
}
