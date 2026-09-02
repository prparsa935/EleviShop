import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  Unique,
} from "typeorm";
import { Mold } from "./Mold.js";
import { Pattern } from "./Pattern.js";

@Unique(["mold", "pattern"])
@Entity()
export class MoldPattern {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Mold, (mold) => mold.moldPatterns, {
    nullable: false,
    onDelete: "CASCADE",
  })
  mold: Relation<Mold>;
  @ManyToOne(() => Pattern, (pattern) => pattern.moldPatterns, {
    nullable: true,
  })
  pattern: Relation<Pattern>;
}
