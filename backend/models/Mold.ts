import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  Relation,
} from "typeorm";
import { MoldSize } from "./MoldSize.js";
import { MoldPattern } from "./MoldPattern.js";

@Entity()
export class Mold {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  name: string;
  @Column({ length: 50, nullable: true })
  shape: string | null;
  @OneToMany(() => MoldSize, (size) => size.mold)
  sizes: Relation<MoldSize>[];
  @OneToMany(() => MoldPattern, (moldPattern) => moldPattern.mold)
  moldPatterns: Relation<MoldPattern>[];
}
