import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import moment = require("moment");
import { User } from "./User";
import { OrderInventory } from "./OrderInventory ";
export enum orderStatus {
  waitingForPayment = "در انتظار پرداخت",
  successfulPayOrValidated = "پرداخت تایید شده",
  delivered = "تحویل شده",
  canceled = "لغو شده",
  waitingFordelivery = "در حال ارسال",
}
// success = "success",
// failed = "failed",
// unpaid = "unpaid",
// deffprice = "deffprice",
// unknown = "unknown",
// anotherMerchantId = "notherMerchantId",
// invalidAuth = "invalidAuth",

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => OrderInventory, (orderInventory) => orderInventory.order, {
    nullable: false,
  })
  orderInventories: OrderInventory[];
  @CreateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
  })
  created_at: Date;
  @ManyToOne(() => User)
  user: User;
  @UpdateDateColumn({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP(6)",
    onUpdate: "CURRENT_TIMESTAMP(6)",
  })
  updated_at: Date;

  @Column({ type: "enum", enum: orderStatus, nullable: false })
  orderStatus: orderStatus;
  @Column()
  price: number;
  @Column()
  bankCode: number;

  @Column()
  bankMessage: string;
  // @OneToOne(()=>User)
  // @JoinColumn()
  // user:User;

  @Column({ unique: true })
  authority: string;

  @Column({ nullable: true })
  cardHash: string;
  @Column({ nullable: true })
  refId: number;
  @Column({ nullable: true })
  cardPan: string;
  @Column({ nullable: true })
  errors: string;

  get faDate(): string {
    return moment(this.created_at).format("jYYYY/jMM/jDD");
  }
  get TotalOrderPrice() {
    let sum: number = 0;
    const orderInventories = this.orderInventories;
    for (let orderInventory of orderInventories) {
      sum += orderInventory.TotalPrice;
    }
    return sum;
  }
  get TotalOrderOffPrice(): number {
    let sum: number = 0;
    const orderInventories = this.orderInventories;
    for (let orderInventory of orderInventories) {
      sum += orderInventory.TotalOffPrice;
    }
    return sum;
  }
}

// })

// module.exports=mongoose.model('orderModel',order)
