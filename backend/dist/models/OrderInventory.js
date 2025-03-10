var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, } from "typeorm";
import { Order } from "./Order.js";
import { Inventory } from "./Inventory.js";
let OrderInventory = class OrderInventory {
    get TotalPrice() {
        const price = this.singleProductPrice;
        const offPercent = this.singleProductOffPercent;
        const finalPrice = price - (price * offPercent) / 100;
        return finalPrice * this.quantity;
    }
    get TotalOffPrice() {
        const price = this.singleProductPrice;
        const offPercent = this.singleProductOffPercent;
        const finalOffPrice = (price * offPercent) / 100;
        return finalOffPrice * this.quantity;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], OrderInventory.prototype, "id", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], OrderInventory.prototype, "quantity", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], OrderInventory.prototype, "singleProductPrice", void 0);
__decorate([
    Column({ nullable: false, default: 0 }),
    __metadata("design:type", Number)
], OrderInventory.prototype, "singleProductOffPercent", void 0);
__decorate([
    ManyToOne(() => Order, (order) => order.orderInventories, { nullable: true }),
    __metadata("design:type", Object)
], OrderInventory.prototype, "order", void 0);
__decorate([
    ManyToOne(() => Inventory, { nullable: false }),
    __metadata("design:type", Inventory)
], OrderInventory.prototype, "inventory", void 0);
OrderInventory = __decorate([
    Entity()
], OrderInventory);
export { OrderInventory };
