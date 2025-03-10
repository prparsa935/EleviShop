var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, ChildEntity, OneToMany } from "typeorm";
import { Product } from "./product.js";
import { Plate } from "./plate.js";
let Service = class Service extends Product {
};
__decorate([
    Column(),
    __metadata("design:type", String)
], Service.prototype, "contain", void 0);
__decorate([
    OneToMany(() => Plate, (plate) => plate.service),
    __metadata("design:type", Array)
], Service.prototype, "plates", void 0);
Service = __decorate([
    ChildEntity("service")
], Service);
export { Service };
