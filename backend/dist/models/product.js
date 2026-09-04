var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, Index, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn, TableInheritance, } from "typeorm";
import { Image } from "./Image.js";
import { Category } from "./Category.js";
import { MoldPattern } from "./MoldPattern.js";
import { Inventory } from "./Inventory.js";
import { Base } from "./Base.js";
// export enum color {
//     yellow = 'yellow',
//     red = 'red',
//   }
let Product = class Product extends Base {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    Index(),
    Column({ type: "varchar", name: "type", default: "plate", length: 10 }),
    __metadata("design:type", String)
], Product.prototype, "type", void 0);
__decorate([
    OneToMany(() => Image, (image) => image.product),
    __metadata("design:type", Array)
], Product.prototype, "images", void 0);
__decorate([
    Column({ nullable: false, length: 100 }),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    Column({ nullable: false, length: 20 }),
    __metadata("design:type", String)
], Product.prototype, "code", void 0);
__decorate([
    Column({ length: 1000 }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    ManyToOne(() => Image, { nullable: false }),
    JoinColumn(),
    __metadata("design:type", Image)
], Product.prototype, "mainImage", void 0);
__decorate([
    Column({ length: 50, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "pattern", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "offPercent", void 0);
__decorate([
    Column({ default: 1 }),
    __metadata("design:type", Number)
], Product.prototype, "countPerProduct", void 0);
__decorate([
    Column({ length: 50, nullable: false }),
    __metadata("design:type", String)
], Product.prototype, "material", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "rate", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "rateScore", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "rateCount", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "buyerCount", void 0);
__decorate([
    Column({ nullable: true, default: 0 }),
    __metadata("design:type", Number)
], Product.prototype, "commentCount", void 0);
__decorate([
    JoinTable(),
    ManyToMany(() => Category),
    __metadata("design:type", Array)
], Product.prototype, "categories", void 0);
__decorate([
    Index(),
    ManyToOne(() => Category),
    __metadata("design:type", Category)
], Product.prototype, "mainCategory", void 0);
__decorate([
    OneToMany(() => Inventory, (inventory) => inventory.product),
    __metadata("design:type", Array)
], Product.prototype, "inventories", void 0);
__decorate([
    Column({ type: "int", nullable: true, default: null }),
    __metadata("design:type", Number)
], Product.prototype, "moldPatternId", void 0);
__decorate([
    ManyToOne(() => MoldPattern, { nullable: true }),
    JoinColumn({ name: "moldPatternId" }),
    __metadata("design:type", Object)
], Product.prototype, "moldPattern", void 0);
Product = __decorate([
    Entity(),
    TableInheritance({
        column: { type: "varchar", name: "type", default: "plate", length: 10 },
    })
], Product);
export { Product };
