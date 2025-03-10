var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// const { Entity, Column, PrimaryGeneratedColumn }=require('typeorm') ;
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, OneToOne, JoinColumn, } from "typeorm";
import { Comment } from "./Comment.js";
import { TfLogin } from "./TfLogin.js";
import { Person } from "./Person.js";
let User = class User {
    get isIdentified() {
        return this.person ? true : false;
    }
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    Column({ nullable: false, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    Column({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "isSuperUser", void 0);
__decorate([
    JoinColumn(),
    OneToOne(() => Person, (person) => person.user),
    __metadata("design:type", Person)
], User.prototype, "person", void 0);
__decorate([
    OneToMany(() => Comment, (comment) => comment.user),
    __metadata("design:type", Array)
], User.prototype, "comments", void 0);
__decorate([
    JoinColumn(),
    OneToOne(() => TfLogin),
    __metadata("design:type", TfLogin)
], User.prototype, "tfLogin", void 0);
User = __decorate([
    Entity()
], User);
export { User };
// const mongoose=require('mongoose')
// const ShoppingCart = require('./ShoppingCart')
// const userSchema=new mongoose.Schema({
//     username:{
//         required:true,
//         type:String,
//         unique:true,
//     },
//     password:{
//         required:true,
//         type:String,
//     },
//     profilePicture:{
//         type:String,
//     },
//     isSuperUser:{
//         type:Boolean,
//         default:false,
//     },
//     ShoppingCart:{
//         required:true,
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'ShoppingCartModel'
//     }
// })
// module.exports=mongoose.model('userModel',userSchema)
