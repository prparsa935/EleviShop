import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Relation,
} from "typeorm";

import { Order } from "./Order.js";

import { Inventory } from "./Inventory.js";

@Entity()
export class OrderInventory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: false })
  quantity: number;
  @Column({ nullable: false })
  singleProductPrice: number;
  @Column({ nullable: false, default: 0 })
  singleProductOffPercent: number;
  @ManyToOne(() => Order, (order) => order.orderInventories, { nullable: true })
  order: Relation<Order>;

  @ManyToOne(() => Inventory, { nullable: false })
  inventory: Inventory;

  get TotalPrice(): number {
    const price: number = this.singleProductPrice;
    const offPercent: number = this.singleProductOffPercent;
    const finalPrice: number = price - (price * offPercent) / 100;

    return finalPrice * this.quantity;
  }
  get TotalOffPrice(): number {
    const price: number = this.singleProductPrice;
    const offPercent: number = this.singleProductOffPercent;
    const finalOffPrice: number = (price * offPercent) / 100;

    return finalOffPrice * this.quantity;
  }
}
