var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, } from "typeorm";
import { MoldSize } from "./MoldSize.js";
import { MoldPattern } from "./MoldPattern.js";
let Mold = class Mold {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Mold.prototype, "id", void 0);
__decorate([
    Column({ length: 50 }),
    __metadata("design:type", String)
], Mold.prototype, "name", void 0);
__decorate([
    Column({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Mold.prototype, "shape", void 0);
__decorate([
    OneToMany(() => MoldSize, (size) => size.mold),
    __metadata("design:type", Array)
], Mold.prototype, "sizes", void 0);
__decorate([
    OneToMany(() => MoldPattern, (moldPattern) => moldPattern.mold),
    __metadata("design:type", Array)
], Mold.prototype, "moldPatterns", void 0);
Mold = __decorate([
    Entity()
], Mold);
export { Mold };
