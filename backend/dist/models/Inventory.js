var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { Product } from "./product.js";
import { Color } from "./Color.js";
import { MoldSize } from "./MoldSize.js";
export var enumSize;
(function (enumSize) {
    enumSize["sm"] = "\u06A9\u0648\u0686\u06A9";
    enumSize["md"] = "\u0645\u062A\u0648\u0633\u0637";
    enumSize["lg"] = "\u0628\u0632\u0631\u06AF";
})(enumSize || (enumSize = {}));
let Inventory = class Inventory {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Inventory.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Inventory.prototype, "quantity", void 0);
__decorate([
    ManyToOne(() => Product),
    __metadata("design:type", Object)
], Inventory.prototype, "product", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], Inventory.prototype, "price", void 0);
__decorate([
    Column({ type: "int", nullable: true, default: null }),
    __metadata("design:type", Number)
], Inventory.prototype, "colorId", void 0);
__decorate([
    ManyToOne(() => Color, { nullable: true }),
    JoinColumn({ name: "colorId" }),
    __metadata("design:type", Object)
], Inventory.prototype, "color", void 0);
__decorate([
    Column({ type: "int", nullable: true, default: null }),
    __metadata("design:type", Number)
], Inventory.prototype, "sizeId", void 0);
__decorate([
    ManyToOne(() => MoldSize, { nullable: true }),
    JoinColumn({ name: "sizeId" }),
    __metadata("design:type", Object)
], Inventory.prototype, "size", void 0);
__decorate([
    Column({ default: 5 }),
    __metadata("design:type", Number)
], Inventory.prototype, "lowStockThreshold", void 0);
Inventory = __decorate([
    Entity()
], Inventory);
export { Inventory };
enumSize.md;
