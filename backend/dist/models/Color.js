var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, } from "typeorm";
let Color = class Color {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Color.prototype, "id", void 0);
__decorate([
    Column({ length: 20 }),
    __metadata("design:type", String)
], Color.prototype, "hexCode", void 0);
__decorate([
    Column({ nullable: false, unique: true, length: 20 }),
    __metadata("design:type", String)
], Color.prototype, "name", void 0);
Color = __decorate([
    Entity()
], Color);
export { Color };
