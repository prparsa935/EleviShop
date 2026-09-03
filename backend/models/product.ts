import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  IntegerType,
  ManyToOne,
  JoinColumn,
  TableInheritance,
  Relation,
} from "typeorm";

import { Image } from "./Image.js";

import { Category } from "./Category.js";
import { MoldPattern } from "./MoldPattern.js";
import { Inventory } from "./Inventory.js";
import { Base } from "./Base.js";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
@TableInheritance({
  column: { type: "varchar", name: "type", default: "plate", length: 10 },
})
export abstract class Product extends Base {
  @PrimaryGeneratedColumn()
  id: number;
  @Index()
  @Column({ type: "varchar", name: "type", default: "plate", length: 10 })
  type: string; // Explicitly define it here!

  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
  @Column({ nullable: false, length: 100 })
  name: string;
  @Column({ nullable: false, length: 20 })
  code: string;
  @Column({ length: 1000 })
  description: string;
  // ManyToOne (not OneToOne): several products (e.g. a plate and a set built
  // from it) must be able to share the same main image. OneToOne put a UNIQUE
  // constraint on mainImageId and crashed every such save with a 500.
  @ManyToOne(() => Image, { nullable: false })
  @JoinColumn()
  mainImage: Image;
  // @Column({ nullable: true })
  // ratio: number;
  @Column({ length: 50, nullable: false })
  pattern: string;
  @Column({ default: 0 })
  offPercent: number;
  @Column({ default: 1 })
  countPerProduct: number;
  @Column({ length: 50, nullable: false })
  material: string;
  @Column({ nullable: true, default: 0 })
  rate: number;
  @Column({ nullable: true, default: 0 })
  rateScore: number;
  @Column({ nullable: true, default: 0 })
  rateCount: number;
  @Column({ nullable: true, default: 0 })
  buyerCount: number;
  @Column({ nullable: true, default: 0 })
  commentCount: number;
  @JoinTable()
  @ManyToMany(() => Category)
  categories: Category[];
  @Index()
  @ManyToOne(() => Category)
  mainCategory: Category;
  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Inventory[];
  @Column({ type: "int", nullable: true, default: null })
  moldPatternId: number | null;
  @ManyToOne(() => MoldPattern, { nullable: true })
  @JoinColumn({ name: "moldPatternId" })
  moldPattern: Relation<MoldPattern>;
}
