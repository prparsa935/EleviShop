import { Type } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from "class-validator";
export class OrderInventorySaveDto {
  @IsNumber()
  @Min(0)
  id: number;
}

export class OrderSaveDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderInventorySaveDto)
  inventory: OrderInventorySaveDto;
  @IsNotEmpty({ message: "تعداد یکی از محصولات اشتباه است" })
  @IsNumber({}, { message: "تعداد" })
  @Min(0)
  @Max(20)
  quantity: number;
  @IsOptional()
  @IsIn(["SIMPLE", "SET"])
  itemType: string;
  @IsOptional()
  @IsNumber()
  productSetId: number;
  @IsOptional()
  @IsNumber()
  colorId: number;
}
