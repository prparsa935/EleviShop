import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Matches,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
import { enumSize } from "../models/Inventory.js";
import { Type } from "class-transformer";
export class InventorySaveDto {
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل 0 " })
  @Max(100, { message: "حداکثر ۹۹ " })
  quantity: number;
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  price: number;
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @IsOptional()
  colorId?: number;
  @IsNumber({}, { message: "لطفا شناسه سایز را به صورت عدد وارد کنید" })
  @IsOptional()
  sizeId?: number;
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @IsOptional()
  id?: number;
}
enum typeEnum {
  plate = "plate",
  productSet = "productSet",
}
// Persian/Arabic block (\u0600-\u06FF covers پ چ ژ گ, Persian digits and ،),
// ZWNJ (\u200C), ASCII letters/digits, spaces and light punctuation — the
// seeded catalogue and realistic Persian copy all contain these
const FA_TEXT = "A-Za-z0-9\\u0600-\\u06FF\\u200C";

export class ProductSaveDto {
  @IsEnum(typeEnum, { message: "نوع محصول درست مشخص نشده است" })
  type: string;
  @ValidateNested({ each: true })
  @Type(() => InventorySaveDto)
  inventories: InventorySaveDto[];
  // @IsNumber({}, { message: "لطفا تعداد را به عدد وارد کنید" })
  // quantity: number;

  // alphanumeric codes like "EL-1026" are valid
  @Matches(RegExp(`^[A-Za-z0-9][A-Za-z0-9\\-]{2,19}$`), {
    message: "لطفا کد محصول را با فرمت درست وارد کنید",
  })
  code: string;
  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,60}$`), {
    message: "لطفا نام محصول را درست واردکنید",
  })
  productName: string;
  @Matches(RegExp(`^[${FA_TEXT}\\s\\-()،.:؛!؟?%]{10,800}$`), {
    message: "لطفا توضیخات محصول را درست واردکنید",
  })
  description: string;
  // @IsNumber({}, { message: "لطفا قیمت را به صورت عدد وارد کنید" })
  // @Min(9999, { message: "حداقل 5 رقم" })
  // @Max(99999999, { message: "حداکثر ۸ رقم" })
  // price: number;
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل 0 درصد" })
  @Max(99, { message: "حداکثر ۹۹ درصد" })
  offPercent: number;
  @Matches(RegExp(`^[${FA_TEXT} \\-]{2,40}$`), {
    message: "لطفا جنس محصول را درست واردکنید",
  })
  material: string;
  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,50}$`), {
    message: "لطفا طرح محصول را درست واردکنید",
  })
  @IsOptional()
  pattern?: string;

  @IsNotEmpty({ message: "لطفا دسته‌بندی را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  categoryId: number;

  @IsNotEmpty({ message: "لطفا تصویر اصلی را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  mainImageId: number;

  @ArrayNotEmpty({ message: "حداقل یک تصویر لازم است" })
  @IsArray()
  @IsNumber({}, { each: true })
  imageIds: number[];
}
export class PlateSaveDto extends ProductSaveDto {
  @IsNotEmpty({ message: "لطفا طرح را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا شناسه طرح را به صورت عدد وارد کنید" })
  moldPatternId: number;
}
export class ProductSetItemSaveDto {
  @IsNotEmpty({ message: "لطفا بشقاب را انتخاب کنید" })
  @IsInt({ message: "لطفا شناسه بشقاب را به صورت عدد وارد کنید" })
  @Min(1, { message: "شناسه بشقاب نامعتبر است" })
  plateId: number;

  @IsInt({ message: "لطفا تعداد را به عدد وارد کنید" })
  @Min(1, { message: "حداقل تعداد 1" })
  @Max(99, { message: "حداکثر تعداد 99" })
  quantity: number;
}

export class ProductSetSaveDto extends ProductSaveDto {
  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,120}$`), {
    message: "لطفا کالا های سرویس را درست وارد کنید",
  })
  contain: string;
  @ArrayNotEmpty({ message: "حداقل یک آیتم لازم است" })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSetItemSaveDto)
  items: ProductSetItemSaveDto[];
  @IsNumber({}, { message: "لطفا قیمت دستی را به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل مقدار 0" })
  @IsOptional()
  manualPriceOverride?: number;
}

export class UpdateProductDto {
  @IsEnum(typeEnum, { message: "نوع محصول درست مشخص نشده است" })
  @IsOptional()
  type?: string;

  @ValidateNested({ each: true })
  @Type(() => InventorySaveDto)
  @IsOptional()
  inventories?: InventorySaveDto[];

  @Matches(RegExp(`^[A-Za-z0-9][A-Za-z0-9\\-]{2,19}$`), {
    message: "لطفا کد محصول را با فرمت درست وارد کنید",
  })
  @IsOptional()
  code?: string;

  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,60}$`), {
    message: "لطفا نام محصول را درست واردکنید",
  })
  @IsOptional()
  productName?: string;

  @Matches(RegExp(`^[${FA_TEXT}\\s\\-()،.:؛!؟?%]{10,800}$`), {
    message: "لطفا توضیخات محصول را درست واردکنید",
  })
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل 0 درصد" })
  @Max(99, { message: "حداکثر ۹۹ درصد" })
  @IsOptional()
  offPercent?: number;

  @Matches(RegExp(`^[${FA_TEXT} \\-]{2,40}$`), {
    message: "لطفا جنس محصول را درست واردکنید",
  })
  @IsOptional()
  material?: string;

  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,50}$`), {
    message: "لطفا طرح محصول را درست واردکنید",
  })
  @IsOptional()
  pattern?: string;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @IsOptional()
  categoryId?: number;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @IsOptional()
  mainImageId?: number;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  imageIds?: number[];

  @IsNumber({}, { message: "لطفا شناسه طرح را به صورت عدد وارد کنید" })
  @IsOptional()
  moldPatternId?: number;

  @Matches(RegExp(`^[${FA_TEXT} ()\\-،.]{3,120}$`), {
    message: "لطفا کالا های سرویس را درست وارد کنید",
  })
  @IsOptional()
  contain?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductSetItemSaveDto)
  @IsOptional()
  items?: ProductSetItemSaveDto[];

  @IsNumber({}, { message: "لطفا قیمت دستی را به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل مقدار 0" })
  @IsOptional()
  manualPriceOverride?: number | null;
}
