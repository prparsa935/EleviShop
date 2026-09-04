import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  Relation,
} from "typeorm";
import { Image } from "./Image.js";
import { MoldPattern } from "./MoldPattern.js";

@Entity()
export class Pattern {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 50 })
  name: string;
  @ManyToOne(() => Image, { nullable: true })
  previewImage: Relation<Image>;
  @OneToMany(() => MoldPattern, (moldPattern) => moldPattern.pattern)
  moldPatterns: Relation<MoldPattern>[];
}
