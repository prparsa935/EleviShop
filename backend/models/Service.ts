import { Entity, Column, ChildEntity, OneToMany } from "typeorm";
import { Product } from "./product";
import { Plate } from "./plate";
@ChildEntity("service")
export class Service extends Product {
  @Column()
  contain: string;
  @OneToMany(() => Plate, (plate) => plate.service)
  plates: Plate[];
}
