var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsBoolean, IsNumber, Matches, Max, Min } from "class-validator";
export var CommentOrders;
(function (CommentOrders) {
    CommentOrders["earliest"] = "earliest";
    CommentOrders["best"] = "best";
})(CommentOrders || (CommentOrders = {}));
// Persian text with half-space, digits and common punctuation must be accepted
export const COMMENT_CONTENT_PATTERN = "^[A-Za-z0-9۰-۹آ-ی\u200c،,.؛;:!؟?\\-() ]{5,1000}$";
export class CommentSaveDto {
}
__decorate([
    Matches(RegExp(COMMENT_CONTENT_PATTERN), {
        message: "لطفا متن نظر خود را کامل کنید (حداقل ۵ کاراکتر)",
    }),
    __metadata("design:type", String)
], CommentSaveDto.prototype, "content", void 0);
__decorate([
    IsNumber({}, { message: "لطفا امتیاز را به صورت عدد وارد کنید" }),
    Min(1, { message: "امتیاز باید بین ۱ تا ۵ باشد" }),
    Max(5, { message: "امتیاز باید بین ۱ تا ۵ باشد" }),
    __metadata("design:type", Number)
], CommentSaveDto.prototype, "rate", void 0);
export class CommentLikeDto {
}
__decorate([
    IsBoolean({ message: "نوع واکنش نامعتبر است" }),
    __metadata("design:type", Boolean)
], CommentLikeDto.prototype, "isLike", void 0);
