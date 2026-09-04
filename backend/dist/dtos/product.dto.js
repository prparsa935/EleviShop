var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArrayNotEmpty, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, Matches, Max, Min, ValidateNested, } from "class-validator";
import { Type } from "class-transformer";
export class InventorySaveDto {
}
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل 0 " }),
    Max(100, { message: "حداکثر ۹۹ " }),
    __metadata("design:type", Number)
], InventorySaveDto.prototype, "quantity", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], InventorySaveDto.prototype, "price", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], InventorySaveDto.prototype, "colorId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا شناسه سایز را به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], InventorySaveDto.prototype, "sizeId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], InventorySaveDto.prototype, "id", void 0);
var typeEnum;
(function (typeEnum) {
    typeEnum["plate"] = "plate";
    typeEnum["productSet"] = "productSet";
})(typeEnum || (typeEnum = {}));
// Persian/Arabic block (\u0600-\u06FF covers پ چ ژ گ, Persian digits and ،),
// ZWNJ (\u200C), ASCII letters/digits, spaces and light punctuation — the
// seeded catalogue and realistic Persian copy all contain these
const FA_TEXT = "A-Za-z0-9\\u0600-\\u06FF\\u200C";
export class ProductSaveDto {
}
__decorate([
    IsEnum(typeEnum, { message: "نوع محصول درست مشخص نشده است" }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "type", void 0);
__decorate([
    ValidateNested({ each: true }),
    Type(() => InventorySaveDto),
    __metadata("design:type", Array)
], ProductSaveDto.prototype, "inventories", void 0);
__decorate([
    Matches(RegExp(`^[A-Za-z0-9][A-Za-z0-9\\-]{2,19}$`), {
        message: "لطفا کد محصول را با فرمت درست وارد کنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "code", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,60}$`), {
        message: "لطفا نام محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "productName", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT}\\s\\-()،.:؛!؟?%]{10,800}$`), {
        message: "لطفا توضیخات محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "description", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل 0 درصد" }),
    Max(99, { message: "حداکثر ۹۹ درصد" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "offPercent", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} \\-]{2,40}$`), {
        message: "لطفا جنس محصول را درست واردکنید",
    }),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "material", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,50}$`), {
        message: "لطفا طرح محصول را درست واردکنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], ProductSaveDto.prototype, "pattern", void 0);
__decorate([
    IsNotEmpty({ message: "لطفا دسته‌بندی را انتخاب کنید" }),
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "categoryId", void 0);
__decorate([
    IsNotEmpty({ message: "لطفا تصویر اصلی را انتخاب کنید" }),
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], ProductSaveDto.prototype, "mainImageId", void 0);
__decorate([
    ArrayNotEmpty({ message: "حداقل یک تصویر لازم است" }),
    IsArray(),
    IsNumber({}, { each: true }),
    __metadata("design:type", Array)
], ProductSaveDto.prototype, "imageIds", void 0);
export class PlateSaveDto extends ProductSaveDto {
}
__decorate([
    IsNotEmpty({ message: "لطفا طرح را انتخاب کنید" }),
    IsNumber({}, { message: "لطفا شناسه طرح را به صورت عدد وارد کنید" }),
    __metadata("design:type", Number)
], PlateSaveDto.prototype, "moldPatternId", void 0);
export class ProductSetItemSaveDto {
}
__decorate([
    IsNotEmpty({ message: "لطفا بشقاب را انتخاب کنید" }),
    IsInt({ message: "لطفا شناسه بشقاب را به صورت عدد وارد کنید" }),
    Min(1, { message: "شناسه بشقاب نامعتبر است" }),
    __metadata("design:type", Number)
], ProductSetItemSaveDto.prototype, "plateId", void 0);
__decorate([
    IsInt({ message: "لطفا تعداد را به عدد وارد کنید" }),
    Min(1, { message: "حداقل تعداد 1" }),
    Max(99, { message: "حداکثر تعداد 99" }),
    __metadata("design:type", Number)
], ProductSetItemSaveDto.prototype, "quantity", void 0);
export class ProductSetSaveDto extends ProductSaveDto {
}
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,120}$`), {
        message: "لطفا کالا های سرویس را درست وارد کنید",
    }),
    __metadata("design:type", String)
], ProductSetSaveDto.prototype, "contain", void 0);
__decorate([
    ArrayNotEmpty({ message: "حداقل یک آیتم لازم است" }),
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ProductSetItemSaveDto),
    __metadata("design:type", Array)
], ProductSetSaveDto.prototype, "items", void 0);
__decorate([
    IsNumber({}, { message: "لطفا قیمت دستی را به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل مقدار 0" }),
    IsOptional(),
    __metadata("design:type", Number)
], ProductSetSaveDto.prototype, "manualPriceOverride", void 0);
export class UpdateProductDto {
}
__decorate([
    IsEnum(typeEnum, { message: "نوع محصول درست مشخص نشده است" }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "type", void 0);
__decorate([
    ValidateNested({ each: true }),
    Type(() => InventorySaveDto),
    IsOptional(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "inventories", void 0);
__decorate([
    Matches(RegExp(`^[A-Za-z0-9][A-Za-z0-9\\-]{2,19}$`), {
        message: "لطفا کد محصول را با فرمت درست وارد کنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "code", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,60}$`), {
        message: "لطفا نام محصول را درست واردکنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "productName", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT}\\s\\-()،.:؛!؟?%]{10,800}$`), {
        message: "لطفا توضیخات محصول را درست واردکنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "description", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل 0 درصد" }),
    Max(99, { message: "حداکثر ۹۹ درصد" }),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "offPercent", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} \\-]{2,40}$`), {
        message: "لطفا جنس محصول را درست واردکنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "material", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,50}$`), {
        message: "لطفا طرح محصول را درست واردکنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "pattern", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "categoryId", void 0);
__decorate([
    IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "mainImageId", void 0);
__decorate([
    IsArray(),
    IsNumber({}, { each: true }),
    IsOptional(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "imageIds", void 0);
__decorate([
    IsNumber({}, { message: "لطفا شناسه طرح را به صورت عدد وارد کنید" }),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "moldPatternId", void 0);
__decorate([
    Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,120}$`), {
        message: "لطفا کالا های سرویس را درست وارد کنید",
    }),
    IsOptional(),
    __metadata("design:type", String)
], UpdateProductDto.prototype, "contain", void 0);
__decorate([
    IsArray(),
    ValidateNested({ each: true }),
    Type(() => ProductSetItemSaveDto),
    IsOptional(),
    __metadata("design:type", Array)
], UpdateProductDto.prototype, "items", void 0);
__decorate([
    IsNumber({}, { message: "لطفا قیمت دستی را به صورت عدد وارد کنید" }),
    Min(0, { message: "حداقل مقدار 0" }),
    IsOptional(),
    __metadata("design:type", Number)
], UpdateProductDto.prototype, "manualPriceOverride", void 0);
