import { Column, ChildEntity, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("productSet")
export class ProductSet extends Product {
  @Column()
  contain: string;
  @OneToMany(() => ProductSetItem, (item) => item.productSet)
  productSetItems: Relation<ProductSetItem>[];
  @Column({ type: "int", nullable: true, default: null })
  manualPriceOverride: number | null;
  @Column({ type: "int", default: 0 })
  calculatedPrice: number;
}
