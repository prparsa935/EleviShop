import { ChildEntity, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("plate")
export class Plate extends Product {
  // NOT named productSetItems: ProductSet declares the same property name and,
  // with single-table inheritance, that definition shadows this one when the
  // shared Product repo resolves relations — plates then came back with an
  // empty list of containing sets
  @OneToMany(() => ProductSetItem, (item) => item.plate)
  plateSetItems: Relation<ProductSetItem>[];
}
