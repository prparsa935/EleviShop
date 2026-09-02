var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, Index, ManyToOne } from "typeorm";
import { Base } from "./Base.js";
import { User } from "./User.js";
import { Product } from "./product.js";
import { Category } from "./Category.js";
export var AnalyticsEventType;
(function (AnalyticsEventType) {
    AnalyticsEventType["PRODUCT_VIEW"] = "PRODUCT_VIEW";
    AnalyticsEventType["ADD_TO_CART"] = "ADD_TO_CART";
    AnalyticsEventType["REMOVE_FROM_CART"] = "REMOVE_FROM_CART";
    AnalyticsEventType["SEARCH"] = "SEARCH";
    AnalyticsEventType["CATEGORY_VIEW"] = "CATEGORY_VIEW";
    AnalyticsEventType["CHECKOUT_START"] = "CHECKOUT_START";
    AnalyticsEventType["PURCHASE_COMPLETE"] = "PURCHASE_COMPLETE";
})(AnalyticsEventType || (AnalyticsEventType = {}));
let AnalyticsEvent = class AnalyticsEvent extends Base {
};
__decorate([
    Column({ type: "enum", enum: AnalyticsEventType, nullable: false }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "eventType", void 0);
__decorate([
    ManyToOne(() => User, { nullable: true }),
    __metadata("design:type", Object)
], AnalyticsEvent.prototype, "user", void 0);
__decorate([
    Column({ type: "varchar", length: 64, nullable: false }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "sessionId", void 0);
__decorate([
    ManyToOne(() => Product, { nullable: true }),
    __metadata("design:type", Object)
], AnalyticsEvent.prototype, "product", void 0);
__decorate([
    ManyToOne(() => Category, { nullable: true }),
    __metadata("design:type", Category)
], AnalyticsEvent.prototype, "category", void 0);
__decorate([
    Column({ type: "varchar", length: 300, nullable: true }),
    __metadata("design:type", String)
], AnalyticsEvent.prototype, "searchQuery", void 0);
__decorate([
    Column({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], AnalyticsEvent.prototype, "metadata", void 0);
AnalyticsEvent = __decorate([
    Entity(),
    Index("IDX_analytics_event_type_date", ["eventType", "dateCreated"]),
    Index("IDX_analytics_session", ["sessionId"])
], AnalyticsEvent);
export { AnalyticsEvent };
