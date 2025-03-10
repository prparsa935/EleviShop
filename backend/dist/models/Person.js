var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, } from "typeorm";
import { User } from "./User.js";
let Person = class Person {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Person.prototype, "id", void 0);
__decorate([
    Column({ length: 20, nullable: false }),
    __metadata("design:type", String)
], Person.prototype, "firstName", void 0);
__decorate([
    Column({ length: 20, nullable: false }),
    __metadata("design:type", String)
], Person.prototype, "lastName", void 0);
__decorate([
    Column({ length: 12, nullable: false }),
    __metadata("design:type", String)
], Person.prototype, "phoneNumber", void 0);
__decorate([
    Column({ nullable: false, length: 100 }),
    __metadata("design:type", String)
], Person.prototype, "addressLine", void 0);
__decorate([
    Column({ length: 10, nullable: false }),
    __metadata("design:type", String)
], Person.prototype, "postalCode", void 0);
__decorate([
    OneToOne(() => User, (user) => user.person),
    __metadata("design:type", Object)
], Person.prototype, "user", void 0);
Person = __decorate([
    Entity()
], Person);
export { Person };
