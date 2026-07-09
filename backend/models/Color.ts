import { Entity, Column } from "typeorm";
import { Base } from "./Base.js";

@Entity()
export class Color extends Base {
  @Column({ length: 20 })
  hexCode: String;
  @Column({ nullable: false, unique: true, length: 20 })
  name: string;
}
