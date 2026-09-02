import { Column, ChildEntity, OneToMany, Relation } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";

@ChildEntity("productSet")
export class ProductSet extends Product {
  @Column()
  contain: string;
  // cascade: saving a NEW ProductSet must persist its member rows too,
  // otherwise newly created sets silently end up with no items
  @OneToMany(() => ProductSetItem, (item) => item.productSet, {
    cascade: true,
  })
  productSetItems: Relation<ProductSetItem>[];
  @Column({ type: "int", nullable: true, default: null })
  manualPriceOverride: number | null;
  @Column({ type: "int", default: 0 })
  calculatedPrice: number;
}
