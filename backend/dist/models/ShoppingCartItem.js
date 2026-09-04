var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, Unique, } from "typeorm";
import { User } from "./User.js";
import { Base } from "./Base.js";
import { Inventory } from "./Inventory.js";
import { ProductSet } from "./ProductSet.js";
import { Color } from "./Color.js";
export var CartItemType;
(function (CartItemType) {
    CartItemType["SIMPLE"] = "SIMPLE";
    CartItemType["SET"] = "SET";
})(CartItemType || (CartItemType = {}));
let ShoppingCartItem = class ShoppingCartItem extends Base {
};
__decorate([
    ManyToOne(() => User, (user) => user.shoppingCartItems),
    __metadata("design:type", Object)
], ShoppingCartItem.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Inventory, { nullable: true }),
    __metadata("design:type", Object)
], ShoppingCartItem.prototype, "inventory", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], ShoppingCartItem.prototype, "count", void 0);
__decorate([
    Column({
        type: "enum",
        enum: CartItemType,
        default: CartItemType.SIMPLE,
    }),
    __metadata("design:type", String)
], ShoppingCartItem.prototype, "itemType", void 0);
__decorate([
    ManyToOne(() => ProductSet, { nullable: true }),
    __metadata("design:type", Object)
], ShoppingCartItem.prototype, "productSet", void 0);
__decorate([
    ManyToOne(() => Color, { nullable: true }),
    __metadata("design:type", Object)
], ShoppingCartItem.prototype, "color", void 0);
ShoppingCartItem = __decorate([
    Unique(["user", "inventory"]),
    Unique(["user", "productSet", "color"]),
    Entity()
], ShoppingCartItem);
export { ShoppingCartItem };
