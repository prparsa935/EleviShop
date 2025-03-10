var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, } from "typeorm";
import { Product } from "./product.js";
import { User } from "./User.js";
import { UserCommentLikes } from "./UserCommentLikes.js";
let Comment = class Comment {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Comment.prototype, "id", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    Column({ nullable: false }),
    __metadata("design:type", Number)
], Comment.prototype, "rate", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "likesCount", void 0);
__decorate([
    Column({ default: 0 }),
    __metadata("design:type", Number)
], Comment.prototype, "dislikesCount", void 0);
__decorate([
    CreateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Comment.prototype, "dateCreated", void 0);
__decorate([
    UpdateDateColumn({
        type: "timestamp",
        default: () => "CURRENT_TIMESTAMP(6)",
        onUpdate: "CURRENT_TIMESTAMP(6)",
    }),
    __metadata("design:type", Date)
], Comment.prototype, "updated_at", void 0);
__decorate([
    ManyToOne(() => Product, (product) => product.comments, { nullable: false }),
    __metadata("design:type", Object)
], Comment.prototype, "product", void 0);
__decorate([
    ManyToOne(() => User, (user) => user.comments, { nullable: false }),
    __metadata("design:type", User)
], Comment.prototype, "user", void 0);
__decorate([
    OneToMany(() => UserCommentLikes, (userCommentLikes) => userCommentLikes.comment),
    __metadata("design:type", Array)
], Comment.prototype, "likes", void 0);
Comment = __decorate([
    Entity()
], Comment);
export { Comment };
