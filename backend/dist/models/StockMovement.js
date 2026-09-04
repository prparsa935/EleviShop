var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, ManyToOne, } from "typeorm";
import { Inventory } from "./Inventory.js";
import { User } from "./User.js";
import { Base } from "./Base.js";
export var MovementType;
(function (MovementType) {
    MovementType["SALE"] = "SALE";
    MovementType["RETURN"] = "RETURN";
    MovementType["MANUAL_ADJUSTMENT"] = "MANUAL_ADJUSTMENT";
    MovementType["RESTOCK"] = "RESTOCK";
    MovementType["BUNDLE_SALE"] = "BUNDLE_SALE";
})(MovementType || (MovementType = {}));
let StockMovement = class StockMovement extends Base {
};
__decorate([
    ManyToOne(() => Inventory, { nullable: false }),
    __metadata("design:type", Object)
], StockMovement.prototype, "inventory", void 0);
__decorate([
    Column({ type: "enum", enum: MovementType, nullable: false }),
    __metadata("design:type", String)
], StockMovement.prototype, "type", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantityChange", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], StockMovement.prototype, "quantityAfter", void 0);
__decorate([
    Column({ nullable: true }),
    __metadata("design:type", String)
], StockMovement.prototype, "reason", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true }),
    __metadata("design:type", Object)
], StockMovement.prototype, "performedBy", void 0);
StockMovement = __decorate([
    Entity()
], StockMovement);
export { StockMovement };
