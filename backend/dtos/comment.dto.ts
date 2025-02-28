import { IsEnum, IsNumber, Matches, Max, Min } from "class-validator";
import { IsNull } from "typeorm";
export enum CommentOrders {
  earliest = "earliest",
  best = "best",
}
export class CommentSaveDto {
  @Matches(RegExp("^[A-Za-zآ-ی ]{10,50}$"), {
    message: "لطفا متن نظر خود را کامل کنید",
  })
  content: string;
  @IsNumber({})
  @Min(1)
  @Max(5)
  rate: number;
}
// export class CommentFindDto {
//   @IsEnum(CommentOrders, { message: "مرتب سازی اشتباه است" })
//   order: CommentOrders;
// }
