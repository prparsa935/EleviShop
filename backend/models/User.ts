// const { Entity, Column, PrimaryGeneratedColumn }=require('typeorm') ;
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from "typeorm";

import { Comment } from "./Comment";
import { type } from "os";
import { TfLogin } from "./TfLogin";
import { Person } from "./Person ";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  phoneNumber: string;

  // @Column({default:'/profilepicture/profilePicture1683742097333-973148340.jpeg'})
  // profilePicture: string;
  @Column({ default: false })
  isSuperUser: boolean;

  @JoinColumn()
  @OneToOne(() => Person, (person) => person.user)
  person: Person;
  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
  @JoinColumn()
  @OneToOne(() => TfLogin)
  tfLogin: TfLogin;
  get isIdentified(): boolean {
    return this.person ? true : false;
  }

  // @OneToMany(() => ProductInCart, (producstIncart) => producstIncart.user, {
  //   cascade: true,
  // })
  // productsInCart: ProductInCart[];
}

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
