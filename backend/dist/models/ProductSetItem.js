var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique, } from "typeorm";
import { ProductSet } from "./ProductSet.js";
import { Plate } from "./plate.js";
let ProductSetItem = class ProductSetItem {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], ProductSetItem.prototype, "id", void 0);
__decorate([
    ManyToOne(() => ProductSet, (productSet) => productSet.productSetItems, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], ProductSetItem.prototype, "productSet", void 0);
__decorate([
    ManyToOne(() => Plate, { nullable: false }),
    __metadata("design:type", Object)
], ProductSetItem.prototype, "plate", void 0);
__decorate([
    Column({ default: 1 }),
    __metadata("design:type", Number)
], ProductSetItem.prototype, "quantity", void 0);
ProductSetItem = __decorate([
    Unique(["productSet", "plate"]),
    Entity()
], ProductSetItem);
export { ProductSetItem };
