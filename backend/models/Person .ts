import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ length: 20, nullable: false })
  firstName: string;
  @Column({ length: 20, nullable: false })
  lastName: string;
  @Column({ length: 11, nullable: false })
  phoneNumber: string;
  @Column({ nullable: false, length: 50 })
  addressLine: string;
  @Column({ length: 10, nullable: false })
  postalCode: string;
}
