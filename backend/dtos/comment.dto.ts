import { IsBoolean, IsNumber, Matches, Max, Min } from "class-validator";
export enum CommentOrders {
  earliest = "earliest",
  best = "best",
}
// Persian text with half-space, digits and common punctuation must be accepted
export const COMMENT_CONTENT_PATTERN =
  "^[A-Za-z0-9۰-۹آ-ی\u200c،,.؛;:!؟?\\-() ]{5,1000}$";
export class CommentSaveDto {
  @Matches(RegExp(COMMENT_CONTENT_PATTERN), {
    message: "لطفا متن نظر خود را کامل کنید (حداقل ۵ کاراکتر)",
  })
  content: string;
  @IsNumber({}, { message: "لطفا امتیاز را به صورت عدد وارد کنید" })
  @Min(1, { message: "امتیاز باید بین ۱ تا ۵ باشد" })
  @Max(5, { message: "امتیاز باید بین ۱ تا ۵ باشد" })
  rate: number;
}
export class CommentLikeDto {
  @IsBoolean({ message: "نوع واکنش نامعتبر است" })
  isLike: boolean; // true = like, false = dislike
}
