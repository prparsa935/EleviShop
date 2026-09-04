import { Column, Entity, Index, ManyToOne, Relation } from "typeorm";

import { Base } from "./Base.js";
import { User } from "./User.js";
import { Product } from "./product.js";
import { Category } from "./Category.js";

export enum AnalyticsEventType {
  PRODUCT_VIEW = "PRODUCT_VIEW",
  ADD_TO_CART = "ADD_TO_CART",
  REMOVE_FROM_CART = "REMOVE_FROM_CART",
  SEARCH = "SEARCH",
  CATEGORY_VIEW = "CATEGORY_VIEW",
  CHECKOUT_START = "CHECKOUT_START",
  PURCHASE_COMPLETE = "PURCHASE_COMPLETE",
}

@Entity()
@Index("IDX_analytics_event_type_date", ["eventType", "dateCreated"])
@Index("IDX_analytics_session", ["sessionId"])
export class AnalyticsEvent extends Base {
  @Column({ type: "enum", enum: AnalyticsEventType, nullable: false })
  eventType: AnalyticsEventType;

  // nullable: کاربر مهمون ممکنه لاگین نباشه
  @ManyToOne(() => User, { nullable: true })
  user: Relation<User>;

  // شناسه سشن برای کاربر مهمون (تولید شده در فرانت)
  @Column({ type: "varchar", length: 64, nullable: false })
  sessionId: string;

  // فقط برای رویدادهای مرتبط با محصول (productId توسط TypeORM ساخته می‌شود)
  @ManyToOne(() => Product, { nullable: true })
  product: Relation<Product>;

  // فقط برای CATEGORY_VIEW (categoryId توسط TypeORM ساخته می‌شود)
  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  // فقط برای SEARCH
  @Column({ type: "varchar", length: 300, nullable: true })
  searchQuery: string;

  // داده اضافه مثل قیمت لحظه‌ای، تعداد و ...
  @Column({ type: "jsonb", nullable: true })
  metadata: Record<string, any>;
}
