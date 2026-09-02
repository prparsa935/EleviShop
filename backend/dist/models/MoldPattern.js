var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique, } from "typeorm";
import { Mold } from "./Mold.js";
import { Pattern } from "./Pattern.js";
let MoldPattern = class MoldPattern {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], MoldPattern.prototype, "id", void 0);
__decorate([
    ManyToOne(() => Mold, (mold) => mold.moldPatterns, {
        nullable: false,
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Object)
], MoldPattern.prototype, "mold", void 0);
__decorate([
    ManyToOne(() => Pattern, (pattern) => pattern.moldPatterns, {
        nullable: true,
    }),
    __metadata("design:type", Object)
], MoldPattern.prototype, "pattern", void 0);
MoldPattern = __decorate([
    Unique(["mold", "pattern"]),
    Entity()
], MoldPattern);
export { MoldPattern };
