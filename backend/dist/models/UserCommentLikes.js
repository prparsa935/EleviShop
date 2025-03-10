var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, } from "typeorm";
import { User } from "./User.js";
import { Comment } from "./Comment.js";
let UserCommentLikes = class UserCommentLikes {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], UserCommentLikes.prototype, "id", void 0);
__decorate([
    ManyToOne(() => User),
    __metadata("design:type", User)
], UserCommentLikes.prototype, "user", void 0);
__decorate([
    ManyToOne(() => Comment, (comment) => comment.likes),
    __metadata("design:type", Object)
], UserCommentLikes.prototype, "comment", void 0);
__decorate([
    Column(),
    __metadata("design:type", Boolean)
], UserCommentLikes.prototype, "isLike", void 0);
UserCommentLikes = __decorate([
    Entity()
], UserCommentLikes);
export { UserCommentLikes };
