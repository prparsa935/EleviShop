import {
  Entity,
  Column,
  ManyToOne,
  Relation,
} from "typeorm";
import { Inventory } from "./Inventory.js";
import { User } from "./User.js";
import { Base } from "./Base.js";

export enum MovementType {
  SALE = "SALE",
  RETURN = "RETURN",
  MANUAL_ADJUSTMENT = "MANUAL_ADJUSTMENT",
  RESTOCK = "RESTOCK",
  RESERVATION = "RESERVATION",
  RESERVATION_RELEASE = "RESERVATION_RELEASE",
}

@Entity()
export class StockMovement extends Base {
  @ManyToOne(() => Inventory, { nullable: false })
  inventory: Relation<Inventory>;

  @Column({ type: "enum", enum: MovementType, nullable: false })
  type: MovementType;

  @Column({ nullable: false })
  quantityChange: number;

  @Column({ nullable: false })
  quantityAfter: number;

  @Column({ nullable: true })
  reason: string;

  @ManyToOne(() => User, { nullable: true })
  performedBy: Relation<User>;
}

/*
 * Reservation Design (آینده):
 *
 * برای پیاده‌سازی رزرو موجودی حین چک‌اوت:
 * 1. وقتی کاربر به صفحه پرداخت می‌ره، یه StockMovement با type=RESERVATION ثبت می‌شه
 *    (quantityChange منفی، ولی موجودی واقعی کم نمی‌شه - یه فیلد reservedQuantity تو Inventory اضافه می‌شه)
 * 2. اگه پرداخت موفق بود: RESERVATION به SALE تبدیل می‌شه و reservedQuantity به quantity کم می‌شه
 * 3. اگه پرداخت ناموفق بود یا timeout (مثلاً ۱۵ دقیقه): RESERVATION_RELEASE ثبت می‌شه و reservedQuantity صفر می‌شه
 * 4. نیاز به cron job یا setTimeout برای پاکسازی رزروهای منقضی‌شده
 *
 * این پیاده‌سازی برای پروژه دانشجویی فعلاً ضروری نیست چون:
 * - ترافیک پایین و احتمال overselling کمه
 * - پیچیدگی cron job و مدیریت timeout اضافه می‌کنه
 * - می‌تونیم بعداً اگه نیاز شد اضافه کنیم
 */
