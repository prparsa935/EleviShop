var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsArray, IsEnum, IsNotEmpty, IsNumber, Matches, Max, Min, ValidateNested, } from "class-validator";
import { enumSize } from "../models/Inventory.js";
import { Type } from "class-transformer";
export class InventorySaveDto {
}
__decorate([
    IsEnum(enumSize, { message: "سایز انتخابی وجود ندارد" }),
    __metadata("design:type", String)
], InventorySaveDto.prototype, "size", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل 0 " }),
    Max(100, { message: "حداکثر ۹۹ " }),
    __metadata("design:type", String)
], InventorySaveDto.prototype, "quantity", void 0);
export class ProductSaveDto {
}
__decorate([
    ValidateNested({ each: true }),
    Type(() => InventorySaveDto),
    __metadata("design:type", Array)
], ProductSaveDto.prototype, "inventories", void 0);
__decorate([
    Matches(RegExp("^[0-9]{5,8}$"), {
        message: "لطفا کد محصول را با فرمت درست وارد کنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "code", void 0);
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{3,15}$"), {
        message: "لطفا نام محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "productName", void 0);
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{10,50}$"), {
        message: "لطفا توضیخات محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "description", void 0);
__decorate([
    IsNumber({}, { message: "لطفا قیمت را به صورت عدد وارد کنید" }),
    Min(9999, { message: "حداقل 5 رقم" }),
    Max(99999999, { message: "حداکثر ۸ رقم" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "price", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل 0 درصد" }),
    Max(99, { message: "حداکثر ۹۹ درصد" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "offPercent", void 0);
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{3,10}$"), {
        message: "لطفا جنس محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "material", void 0);
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{3,10}$"), {
        message: "لطفا طرح محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "pattern", void 0);
__decorate([
    IsNotEmpty({ message: "لطفا خالی نگذارید" }),
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "height", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "categoryId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "brandId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "colorId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "mainImageId", void 0);
__decorate([
    IsArray(),
    __metadata("design:type", Array)
], ProductSaveDto.prototype, "imageIds", void 0);
