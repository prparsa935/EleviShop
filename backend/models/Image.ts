import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  ManyToOne,
} from "typeorm";

import { Product } from "./product";

// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Product)
  product: Product;
  @Column({ nullable: false })
  filePath: String;
}
