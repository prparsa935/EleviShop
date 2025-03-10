var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, BeforeInsert, } from "typeorm";
import moment from "moment-jalaali";
import { User } from "./User.js";
import { OrderInventory } from "./OrderInventory.js";
import { Person } from "./Person.js";
import { Expose } from "class-transformer";
export var orderStatus;
(function (orderStatus) {
    orderStatus["waitingForPayment"] = "\u062F\u0631 \u0627\u0646\u062A\u0638\u0627\u0631 \u067E\u0631\u062F\u0627\u062E\u062A";
    orderStatus["successfulPayOrValidated"] = "\u067E\u0631\u062F\u0627\u062E\u062A \u062A\u0627\u06CC\u06CC\u062F \u0634\u062F\u0647";
    orderStatus["delivered"] = "\u062A\u062D\u0648\u06CC\u0644 \u0634\u062F\u0647";
    orderStatus["canceled"] = "\u0644\u063A\u0648 \u0634\u062F\u0647";
    orderStatus["waitingFordelivery"] = "\u062F\u0631 \u062D\u0627\u0644 \u0627\u0631\u0633\u0627\u0644";
})(orderStatus || (orderStatus = {}));
// success = "success",
// failed = "failed",
// unpaid = "unpaid",
// deffprice = "deffprice",
// unknown = "unknown",
// anotherMerchantId = "notherMerchantId",
// invalidAuth = "invalidAuth",
let Order = class Order {
    // @Column()
    // bankCode: number;
    // @Column()
    // bankMessage: string;
    // // @OneToOne(()=>User)
    // // @JoinColumn()
    // // user:User;
    // @Column({ unique: true })
    // authority: string;
    // @Column({ nullable: true })
    // cardHash: string;
    // @Column({ nullable: true })
    // refId: number;
    // @Column({ nullable: true })
    // cardPan: string;
    // @Column({ nullable: true })
    // errors: string;
    generateTrackingCode() {
        const date = new Date();
        const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format
        const randomSuffix = Math.floor(1000 + Math.random() * 90000); // Random 4-digit suffix
        this.trackingCode = `${formattedDate}${randomSuffix}`;
    }
    get faDateCreated() {
        return moment(this.dateCreated).format("jYYYY/jMM/jDD");
    }
    get totalOrderPrice() {
        let sum = 0;
        const orderInventories = this.orderInventories;
        for (let orderInventory of orderInventories) {
            sum += orderInventory.TotalPrice;
        }
        return sum;
    }
    get totalOrderOffPrice() {
        let sum = 0;
        const orderInventories = this.orderInventories;
        for (let orderInventory of orderInventories) {
            sum += orderInventory.TotalOffPrice;
        }
        return sum;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Order.prototype, "id", void 0);
__decorate([
    Column({ unique: true }),
    __metadata("design:type", String)
], Order.prototype, "trackingCode", void 0);
__decorate([
    OneToMany(() => OrderInventory, (orderInventory) => orderInventory.order, {
        nullable: false,
    }),
    __metadata("design:type", Array)
], Order.prototype, "orderInventories", void 0);
__decorate([
    CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Order.prototype, "dateCreated", void 0);
__decorate([
    ManyToOne(() => User),
    __metadata("design:type", User)
], Order.prototype, "user", void 0);
__decorate([
    UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Order.prototype, "updated_at", void 0);
__decorate([
    ManyToOne(() => Person, { nullable: true }),
    __metadata("design:type", Person)
], Order.prototype, "person", void 0);
__decorate([
    Column({ type: "enum", enum: orderStatus, nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "orderStatus", void 0);
__decorate([
    BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Order.prototype, "generateTrackingCode", null);
__decorate([
    Expose(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], Order.prototype, "faDateCreated", null);
__decorate([
    Expose(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Order.prototype, "totalOrderPrice", null);
__decorate([
    Expose(),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Order.prototype, "totalOrderOffPrice", null);
Order = __decorate([
    Entity()
], Order);
export { Order };
// })
// module.exports=mongoose.model('orderModel',order)
