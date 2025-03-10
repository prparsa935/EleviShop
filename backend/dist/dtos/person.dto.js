var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Matches } from "class-validator";
export class PersonSaveDto {
}
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{3,20}$"), {
        message: "لطفا نام خانوادگی را درست وارد کنید",
    }),
    __metadata("design:type", String)
], PersonSaveDto.prototype, "firstName", void 0);
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{3,20}$"), {
        message: "لطفا نام خانوادگی را درست وارد کنید",
    }),
    __metadata("design:type", String)
], PersonSaveDto.prototype, "lastName", void 0);
__decorate([
    Matches(RegExp("^09\\d{9}$"), {
        message: "لطفا شماره همراه را درست وارد کنید",
    }),
    __metadata("design:type", String)
], PersonSaveDto.prototype, "phoneNumber", void 0);
__decorate([
    Matches(RegExp("^[0-9]{10}$"), {
        message: "کد پستی نادرست است",
    }),
    __metadata("design:type", String)
], PersonSaveDto.prototype, "postalCode", void 0);
__decorate([
    Matches(RegExp("^[0-9-A-Za-zآ-ی ]{10,50}$"), { message: "آدرس نادرست است." }),
    __metadata("design:type", String)
], PersonSaveDto.prototype, "addressLine", void 0);
