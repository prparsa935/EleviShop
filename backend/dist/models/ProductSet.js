var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, ChildEntity, OneToMany } from "typeorm";
import { Product } from "./product.js";
import { ProductSetItem } from "./ProductSetItem.js";
let ProductSet = class ProductSet extends Product {
};
__decorate([
    Column(),
    __metadata("design:type", String)
], ProductSet.prototype, "contain", void 0);
__decorate([
    OneToMany(() => ProductSetItem, (item) => item.productSet, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], ProductSet.prototype, "productSetItems", void 0);
__decorate([
    Column({ type: "int", nullable: true, default: null }),
    __metadata("design:type", Number)
], ProductSet.prototype, "manualPriceOverride", void 0);
__decorate([
    Column({ type: "int", default: 0 }),
    __metadata("design:type", Number)
], ProductSet.prototype, "calculatedPrice", void 0);
ProductSet = __decorate([
    ChildEntity("productSet")
], ProductSet);
export { ProductSet };
