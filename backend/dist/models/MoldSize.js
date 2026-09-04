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
import { Mold } from "./Mold.js";
let MoldSize = class MoldSize {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MoldSize.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Mold, (mold) => mold.sizes, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], MoldSize.prototype, "mold", void 0);
__decorate([
    Column({ length: 50 }),
    __metadata("design:type", String)
], MoldSize.prototype, "sizeLabel", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], MoldSize.prototype, "height", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], MoldSize.prototype, "width", void 0);
__decorate([
    Column({ type: "int", nullable: true }),
    __metadata("design:type", Number)
], MoldSize.prototype, "weight", void 0);
MoldSize = __decorate([
    Unique(["mold", "sizeLabel"]),
    Entity()
], MoldSize);
export { MoldSize };
