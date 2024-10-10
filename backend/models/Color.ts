import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from "typeorm";

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20 })
  hexCode: String;
  @Column({ nullable: false, unique: true, length: 20 })
  name: string;
}
