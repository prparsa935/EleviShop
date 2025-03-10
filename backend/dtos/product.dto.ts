import {
  IsArray,
  IsEnum,
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
  @IsEnum(enumSize, { message: "سایز انتخابی وجود ندارد" })
  size: string;
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  @Min(0, { message: "حداقل 0 " })
  @Max(100, { message: "حداکثر ۹۹ " })
  quantity: string;
}
export class ProductSaveDto {
  @ValidateNested({ each: true })
  @Type(() => InventorySaveDto)
  inventories: InventorySaveDto[];

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
  @IsNumber({}, { message: "لطفا قیمت را به صورت عدد وارد کنید" })
  @Min(9999, { message: "حداقل 5 رقم" })
  @Max(99999999, { message: "حداکثر ۸ رقم" })
  price: number;
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
  @IsNotEmpty({ message: "لطفا خالی نگذارید" })
  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  height: number;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  categoryId: number;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  brandId: number;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  colorId: number;

  @IsNumber({}, { message: "لطفا به صورت عدد وارد کنید" })
  mainImageId: number;
  @IsArray()
  imageIds: number[];
}
