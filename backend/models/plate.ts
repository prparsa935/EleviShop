import { Entity, Column, ChildEntity, ManyToOne, Relation } from "typeorm";
import { Product } from "./product.js";
import { Service } from "./Service.js";

@ChildEntity("plate")
export class Plate extends Product {
  @Column({ nullable: true })
  weight: number;
  @Column({ nullable: true })
  height: number;
  @Column({ nullable: true })
  width: number;
  @ManyToOne(() => Service, (service) => service.plates)
  service: Relation<Service>;
}
