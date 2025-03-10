import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
  Relation,
} from "typeorm";

import { Product } from "./product.js";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Product)
  product: Relation<Product>;
  @Column({ nullable: false })
  filePath: String;
}
