import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
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
}
enum typeEnum {
  plate = "plate",
  service = "service",
}
export class ProductSaveDto {
  @IsEnum(typeEnum, { message: "نوع محصول درست مشخص نشده است" })
  type: string;
  @ValidateNested({ each: true })
  @Type(() => InventorySaveDto)
  inventories: InventorySaveDto[];
  // @IsNumber({}, { message: "لطفا تعداد را به عدد وارد کنید" })
  // quantity: number;

  @Matches(RegExp("^[0-9]{5,8}$"), {
    message: "لطفا کد محصول را با فرمت درست وارد کنید",
  })
  code: string;
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,15}$"), {
    message: "لطفا نام محصول را درست واردکنید",
  })
  productName: string;
  @Matches(RegExp("^[A-Za-zآ-ی ]{10,50}$"), {
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
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,10}$"), {
    message: "لطفا جنس محصول را درست واردکنید",
  })
  material: string;
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,10}$"), {
    message: "لطفا طرح محصول را درست واردکنید",
  })
  pattern: string;

  @IsNotEmpty({ message: "لطفا دسته‌بندی را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  categoryId: number;

  @IsNotEmpty({ message: "لطفا رنگ را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  colorId: number;

  @IsNotEmpty({ message: "لطفا تصویر اصلی را انتخاب کنید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  mainImageId: number;

  @ArrayNotEmpty({ message: "حداقل یک تصویر لازم است" })
  @IsArray()
  @IsNumber({}, { each: true })
  imageIds: number[];
}
export class PlateSaveDto extends ProductSaveDto {
  @IsNotEmpty({ message: "لطفا خالی نگذارید" })
  @IsNumber({}, { message: "لطفا عرض را به صورت عدد وارد کنید" })
  @Min(1, { message: "حداقل مقدار 1" })
  @Max(1000, { message: "حداکثر مقدار 1000" })
  height: number;

  @IsNotEmpty({ message: "لطفا خالی نگذارید" })
  @IsNumber({}, { message: "لطفا وزن را به صورت عدد وارد کنید" })
  @Min(1, { message: "حداقل مقدار 1" })
  @Max(1000, { message: "حداکثر مقدار 1000" })
  weight: number;

  @IsNotEmpty({ message: "لطفا خالی نگذارید" })
  @IsNumber({}, { message: "لطفا طول را به صورت عدد وارد کنید" })
  @Min(1, { message: "حداقل مقدار 1" })
  @Max(1000, { message: "حداکثر مقدار 1000" })
  width: number;
}
export class ServiceSaveDto extends ProductSaveDto {
  @Matches(RegExp("^[A-Za-zآ-ی ]{3,10}$"), {
    message: "لطفا کالا های سرویس را درست وارد کنید",
  })
  contain: string;
  @ArrayNotEmpty({ message: "حداقل یک آیتم لازم است" })
  @IsArray()
  @IsInt({ each: true }) // هر عضو باید عدد صحیح باشد
  @Min(1, { each: true }) // هر عدد حداقل 1 باشد
  plateIds: number[];
}
