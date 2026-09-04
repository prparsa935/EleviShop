import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
  Unique,
} from "typeorm";
import { Mold } from "./Mold.js";

@Unique(["mold", "sizeLabel"])
@Entity()
export class MoldSize {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Mold, (mold) => mold.sizes, {
    nullable: false,
    onDelete: "CASCADE",
  })
  mold: Relation<Mold>;
  @Column({ length: 50 })
  sizeLabel: string;
  @Column({ type: "int", nullable: true })
  height: number | null;
  @Column({ type: "int", nullable: true })
  width: number | null;
  @Column({ type: "int", nullable: true })
  weight: number | null;
}
