var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsNumber, Matches, Max, Min } from "class-validator";
export var CommentOrders;
(function (CommentOrders) {
    CommentOrders["earliest"] = "earliest";
    CommentOrders["best"] = "best";
})(CommentOrders || (CommentOrders = {}));
export class CommentSaveDto {
}
__decorate([
    Matches(RegExp("^[A-Za-zآ-ی ]{10,50}$"), {
        message: "لطفا متن نظر خود را کامل کنید",
    }),
    __metadata("design:type", String)
], CommentSaveDto.prototype, "content", void 0);
__decorate([
    IsNumber({}),
    Min(1),
    Max(5),
    __metadata("design:type", Number)
], CommentSaveDto.prototype, "rate", void 0);
// export class CommentFindDto {
//   @IsEnum(CommentOrders, { message: "مرتب سازی اشتباه است" })
//   order: CommentOrders;
// }
