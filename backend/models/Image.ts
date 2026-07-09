import { Entity, Column, ManyToOne, Relation } from "typeorm";

import { Product } from "./product.js";
import { Base } from "./Base.js";

@Entity()
export class Image extends Base {
  @ManyToOne(() => Product)
  product: Relation<Product>;
  @Column({ nullable: false })
  filePath: String;
}
