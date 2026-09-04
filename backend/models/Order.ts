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
  BeforeInsert,
  AfterInsert,
} from "typeorm";
import moment from "moment-jalaali";
import { User } from "./User.js";
import { OrderInventory } from "./OrderInventory.js";
import { Person } from "./Person.js";
import { Expose } from "class-transformer";
import { Base } from "./Base.js";
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
export class Order extends Base {
  @Column({ unique: true })
  trackingCode: string;
  @OneToMany(() => OrderInventory, (orderInventory) => orderInventory.order, {
    nullable: false,
  })
  orderInventories: OrderInventory[];

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Person, { nullable: true })
  person: Person;

  @Column({ type: "enum", enum: orderStatus, nullable: false })
  orderStatus: orderStatus;

  @BeforeInsert()
  generateTrackingCode() {
    const date = new Date();
    const formattedDate = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD format
    const randomSuffix = Math.floor(1000 + Math.random() * 90000); // Random 4-digit suffix
    this.trackingCode = `${formattedDate}${randomSuffix}`;
  }

  @Expose()
  get faDateCreated(): string {
    return moment(this.dateCreated).format("jYYYY/jMM/jDD");
  }
  @Expose()
  get totalOrderPrice() {
    let sum: number = 0;
    const orderInventories = this.orderInventories;
    for (let orderInventory of orderInventories) {
      sum += orderInventory.TotalPrice;
    }
    return sum;
  }
  @Expose()
  get totalOrderOffPrice(): number {
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
