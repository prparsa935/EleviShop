var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn, TableInheritance, } from "typeorm";
import { Image } from "./Image.js";
import { Comment } from "./Comment.js";
import { Color } from "./Color.js";
import { Category } from "./Category.js";
import { Inventory } from "./Inventory.js";
// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
let Product = class Product {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    OneToMany(() => Image, (image) => image.product),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    Column({ nullable: false, length: 20 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    Column({ nullable: false, length: 20 }),
    __metadata("design:type", String)
], Product.prototype, "code", void 0);
__decorate([
    Column({ length: 50 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    OneToOne(() => Image, { nullable: false }),
    JoinColumn(),
    __metadata("design:type", Image)
], Product.prototype, "mainImage", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "ratio", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    Column({ length: 10, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "pattern", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "offPercent", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "material", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", Number)
], Product.prototype, "rate", void 0);
__decorate([
    OneToOne(() => Color),
    JoinColumn(),
    __metadata("design:type", Color)
], Product.prototype, "color", void 0);
__decorate([
    OneToMany(() => Comment, (comment) => comment.product, { cascade: true }),
    __metadata("design:type", Array)
], Product.prototype, "comments", void 0);
__decorate([
    JoinTable(),
    ManyToMany(() => Category),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    ManyToOne(() => Category),
    __metadata("design:type", Category)
], Product.prototype, "mainCategory", void 0);
__decorate([
    OneToMany(() => Inventory, (inventory) => inventory.product),
    __metadata("design:type", Array)
], Product.prototype, "inventories", void 0);
Product = __decorate([
    Entity(),
    TableInheritance({
        column: { type: "varchar", name: "type", default: "plate" },
    })
], Product);
export { Product };
