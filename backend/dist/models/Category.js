var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, } from "typeorm";
let Category = class Category {
    get categoryPath() {
        const parents = [];
        let currentCategory = this.parentCategory;
        while (currentCategory) {
            parents.push(currentCategory.name);
            currentCategory = currentCategory.parentCategory; // Move up the hierarchy
        }
        return parents;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    Column({ unique: true, length: 20, nullable: false }),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    ManyToOne(() => Category),
    __metadata("design:type", Category)
], Category.prototype, "parentCategory", void 0);
__decorate([
    OneToMany(() => Category, (category) => category.parentCategory),
    __metadata("design:type", Array)
], Category.prototype, "childCategories", void 0);
Category = __decorate([
    Entity()
], Category);
export { Category };
