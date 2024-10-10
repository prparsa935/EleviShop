import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

import { Order } from "./Order";

import { Inventory } from "./Inventory";

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
  order: Order;

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
