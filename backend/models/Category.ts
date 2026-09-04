import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Base } from "./Base.js";

@Entity()
export class Category extends Base {
 
  @Column({ unique: true, length: 20, nullable: false })
  name: string;
  @ManyToOne(() => Category)
  parentCategory: Category;
  @OneToMany(() => Category, (category) => category.parentCategory)
  childCategories: Category[];

  get categoryPath(): string[] {
    const parents: string[] = [];
    let currentCategory: Category | undefined = this.parentCategory;

    while (currentCategory) {
      parents.push(currentCategory.name);
      currentCategory = currentCategory.parentCategory; // Move up the hierarchy
    }

    return parents;
  }
}
