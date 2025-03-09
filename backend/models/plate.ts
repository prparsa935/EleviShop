import { Entity, Column, ChildEntity, ManyToOne } from "typeorm";
import { Product } from "./product";
import { Service } from "./Service";

@ChildEntity("plate")
export class Plate extends Product {
  @Column({ nullable: true })
  weight: number;
  @Column({ nullable: true })
  height: number;
  @Column({ nullable: true })
  width: number;
  @ManyToOne(() => Service, (service) => service.plates)
  service: Service;
}
