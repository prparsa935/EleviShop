import { IsNumber, IsOptional, IsString } from "class-validator";

export class StockAdjustDto {
  @IsNumber()
  inventoryId: number;

  @IsNumber()
  quantityChange: number;

  @IsOptional()
  @IsString()
  reason: string;
}
