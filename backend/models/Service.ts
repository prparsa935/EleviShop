import { Entity, Column, ChildEntity, OneToMany } from "typeorm";
import { Product } from "./product.js";
import { Plate } from "./plate.js";
@ChildEntity("service")
export class Service extends Product {
  @Column()
  contain: string;
  @OneToMany(() => Plate, (plate) => plate.service)
  plates: Plate[];
}
