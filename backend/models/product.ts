import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  IntegerType,
  ManyToOne,
  JoinColumn,
  TableInheritance,
} from "typeorm";

import { Image } from "./Image";
import { Comment } from "./Comment";

import { Color } from "./Color";
import { Category } from "./Category";
import { Inventory } from "./Inventory";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
@TableInheritance({
  column: { type: "varchar", name: "type", default: "plate" },
})
export abstract class Product {
  @PrimaryGeneratedColumn()
  id: number;
  @OneToMany(() => Image, (image) => image.product)
  images: Image[];
  @Column({ nullable: false, length: 20 })
  name: string;
  @Column({ nullable: false, length: 20 })
  code: string;
  @Column({ length: 50 })
  description: string;
  @OneToOne(() => Image, { nullable: false })
  @JoinColumn()
  mainImage: Image;
  @Column({ nullable: true })
  ratio: number;
  @Column({ nullable: false })
  price: number;
  @Column({ length: 10, nullable: false })
  pattern: string;
  @Column({ default: 0 })
  offPercent: number;
  @Column({ nullable: false })
  material: string;
  @Column({ nullable: true })
  rate: number;
  @OneToOne(() => Color)
  @JoinColumn()
  color: Color;
  @OneToMany(() => Comment, (comment) => comment.product, { cascade: true })
  comments: Comment[];
  @JoinTable()
  @ManyToMany(() => Category)
  categories: Category[];
  @ManyToOne(() => Category)
  mainCategory: Category;
  @OneToMany(() => Inventory, (inventory) => inventory.product)
  inventories: Inventory[];
}
