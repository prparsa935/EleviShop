import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  Unique,
} from "typeorm";
import { ProductSet } from "./ProductSet.js";
import { Plate } from "./plate.js";

@Unique(["productSet", "plate"])
@Entity()
export class ProductSetItem {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => ProductSet, (productSet) => productSet.productSetItems, {
    nullable: false,
    onDelete: "CASCADE",
  })
  productSet: Relation<ProductSet>;
  @ManyToOne(() => Plate, { nullable: false })
  plate: Relation<Plate>;
  @Column({ default: 1 })
  quantity: number;
}
