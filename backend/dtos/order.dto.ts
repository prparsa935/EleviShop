import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
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
  @IsNotEmpty({ message: "محصول انتخابی اشتباه است" })
  @ValidateNested({ each: true })
  @Type(() => OrderInventorySaveDto)
  inventory: OrderInventorySaveDto;
  @IsNotEmpty({ message: "تعداد یکی از محصولات اشتباه است" })
  @IsNumber({}, { message: "تعداد" })
  @Min(0)
  @Max(20)
  quantity: number;
}
