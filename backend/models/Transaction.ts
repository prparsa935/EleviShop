// import { Entity, Column, PrimaryGeneratedColumn, OneToOne,JoinColumn, ManyToOne, OneToMany, IntegerType } from 'typeorm';


// import { Plate } from './Plate';
// import { User } from './user';
// import { ProductInCart } from './ProductInCart';
// import { Order } from './Order';

// export enum status{
//     inProgress='inProgress',
//     success='success',
//     failed='failed',
//     unpaid='unpaid',
//     deffprice='deffprice',
//     unknown='unknown',
//     anotherMerchantId='notherMerchantId',
//     invalidAuth='invalidAuth'
    
// }

// @Entity()
// export class Transaction {
//   @PrimaryGeneratedColumn()
//   id: number;
//   @Column()
//   price:number
//   @Column()
//   bankCode:number;
//   @Column()
//   bankMessage:string;
//   @OneToOne(()=>User)
//   @JoinColumn()
//   user:User;
//   @OneToMany(()=>ProductInCart,(productInCart)=>productInCart.transaction,{cascade:true})
//   productsInCart:ProductInCart[]
//   @Column({unique:true})
//   authority:string;
//   @Column({type:'enum',enum:status})
//   status:status
//   @Column({nullable:true})
//   cardHash:string;
//   @Column({nullable:true})
//   refId:number;
//   @Column({nullable:true})
//   cardPan:string
//   @Column({nullable:true})
//   errors:string;
//   @OneToOne(()=>Order)
//   @JoinColumn()
//   order:Order
  
 


// }