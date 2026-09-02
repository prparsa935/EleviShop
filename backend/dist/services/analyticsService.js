import { In } from "typeorm";
import dataSource from "../utils/dbConfiguration.js";
import { AnalyticsEvent, AnalyticsEventType } from "../models/AnalyticsEvent.js";
import { Order, orderStatus } from "../models/Order.js";
import { OrderInventory } from "../models/OrderInventory.js";
import { Product } from "../models/product.js";
import { Category } from "../models/Category.js";
const soldOrderStatuses = [
    orderStatus.successfulPayOrValidated,
    orderStatus.waitingFordelivery,
    orderStatus.delivered,
];
class AnalyticsService {
    constructor() {
        this.eventRepo = dataSource.getRepository(AnalyticsEvent);
        this.productRepo = dataSource.getRepository(Product);
        this.orderRepo = dataSource.getRepository(Order);
        this.orderInventoryRepo = dataSource.getRepository(OrderInventory);
    }
    /**
     * ثبت رویداد — ساده و سریع. هیچ‌وقت exception پرتاب نمی‌کند تا
     * جریان اصلی خرید کاربر خراب نشود؛ فقط لاگ می‌کند.
     */
    async trackEvent(eventData, user) {
        try {
            const event = new AnalyticsEvent();
            event.eventType = eventData.eventType;
            event.sessionId = eventData.sessionId || "anonymous";
            if (user)
                event.user = user;
            if (eventData.productId) {
                const productExists = await this.productRepo.exist({
                    where: { id: eventData.productId },
                });
                if (productExists) {
                    event.product = { id: eventData.productId };
                }
            }
            if (eventData.categoryId) {
                const categoryExists = await dataSource
                    .getRepository(Category)
                    .exist({ where: { id: eventData.categoryId } });
                if (categoryExists) {
                    event.category = { id: eventData.categoryId };
                }
            }
            if (eventData.searchQuery) {
                event.searchQuery = String(eventData.searchQuery).slice(0, 300);
            }
            if (eventData.metadata && typeof eventData.metadata === "object") {
                event.metadata = eventData.metadata;
            }
            await this.eventRepo.insert(event);
        }
        catch (error) {
            console.error("analytics trackEvent failed:", error?.message);
        }
    }
    applyDateRange(qb, dateRange) {
        if (dateRange.from) {
            qb.andWhere("event.dateCreated >= :from", { from: dateRange.from });
        }
        if (dateRange.to) {
            qb.andWhere("event.dateCreated <= :to", { to: dateRange.to });
        }
        return qb;
    }
    async countEvents(eventTypes, dateRange = {}) {
        const qb = this.applyDateRange(this.eventRepo
            .createQueryBuilder("event")
            .select("event.eventType", "eventType")
            .addSelect("COUNT(*)", "count")
            .where("event.eventType IN (:...eventTypes)", { eventTypes }), dateRange).groupBy("event.eventType");
        const rows = await qb.getRawMany();
        const counts = new Map(rows.map((row) => [row.eventType, Number(row.count)]));
        const result = {};
        for (const eventType of eventTypes) {
            result[eventType] = counts.get(eventType) || 0;
        }
        return result;
    }
    async getMostViewedProducts(dateRange = {}, limit = 10) {
        const qb = this.applyDateRange(this.eventRepo
            .createQueryBuilder("event")
            .select("event.productId", "productId")
            .addSelect("product.name", "productName")
            .addSelect("mainImage.filePath", "imagePath")
            .addSelect("COUNT(*)", "viewCount")
            .leftJoin("event.product", "product")
            .leftJoin("product.mainImage", "mainImage")
            .where("event.eventType = :eventType", {
            eventType: AnalyticsEventType.PRODUCT_VIEW,
        })
            .andWhere("event.productId IS NOT NULL"), dateRange)
            .groupBy("event.productId")
            .addGroupBy("product.name")
            .addGroupBy("mainImage.filePath")
            .orderBy('"viewCount"', "DESC")
            .limit(limit);
        const rows = await qb.getRawMany();
        return rows.map((row) => ({
            productId: Number(row.productId),
            productName: row.productName,
            imagePath: row.imagePath,
            viewCount: Number(row.viewCount),
        }));
    }
    async getConversionFunnel(dateRange = {}) {
        const rows = await this.applyDateRange(this.eventRepo
            .createQueryBuilder("event")
            .select("event.eventType", "eventType")
            .addSelect("COUNT(*)", "count")
            .where("event.eventType IN (:...eventTypes)", {
            eventTypes: [
                AnalyticsEventType.PRODUCT_VIEW,
                AnalyticsEventType.ADD_TO_CART,
                AnalyticsEventType.PURCHASE_COMPLETE,
            ],
        }), dateRange)
            .groupBy("event.eventType")
            .getRawMany();
        const counts = new Map(rows.map((row) => [row.eventType, Number(row.count)]));
        return [
            {
                stage: AnalyticsEventType.PRODUCT_VIEW,
                label: "بازدید محصول",
                count: counts.get(AnalyticsEventType.PRODUCT_VIEW) || 0,
            },
            {
                stage: AnalyticsEventType.ADD_TO_CART,
                label: "افزودن به سبد",
                count: counts.get(AnalyticsEventType.ADD_TO_CART) || 0,
            },
            {
                stage: AnalyticsEventType.PURCHASE_COMPLETE,
                label: "خرید نهایی",
                count: counts.get(AnalyticsEventType.PURCHASE_COMPLETE) || 0,
            },
        ];
    }
    /**
     * فروش واقعی از جدول Order محاسبه می‌شود (نه AnalyticsEvent)
     * چون فروش واقعی باید از سفارش واقعی بیاید.
     */
    async getSalesOverTime(dateRange = {}, groupBy = "day") {
        const pattern = groupBy === "week" ? 'IYYY-"W"IW' : "YYYY-MM-DD";
        const qb = this.orderRepo
            .createQueryBuilder("order")
            .select(`TO_CHAR(order.dateCreated, '${pattern}')`, "period")
            .addSelect("COALESCE(SUM(oi.singleProductPrice * (100 - oi.singleProductOffPercent) / 100.0 * oi.quantity), 0)", "totalSales")
            .addSelect("COUNT(DISTINCT order.id)", "orderCount")
            .leftJoin("order.orderInventories", "oi")
            .where("order.orderStatus IN (:...soldStatuses)", {
            soldStatuses: soldOrderStatuses,
        });
        if (dateRange.from) {
            qb.andWhere("order.dateCreated >= :from", { from: dateRange.from });
        }
        if (dateRange.to) {
            qb.andWhere("order.dateCreated <= :to", { to: dateRange.to });
        }
        const rows = await qb
            .groupBy("period")
            .orderBy("period", "ASC")
            .getRawMany();
        return rows.map((row) => ({
            period: row.period,
            totalSales: Number(row.totalSales),
            orderCount: Number(row.orderCount),
        }));
    }
    /**
     * محصولاتی که ADD_TO_CART زیاد ولی خرید واقعی (از سفارش‌ها) کم دارند —
     * سیگنال قیمت‌گذاری / موجودی.
     */
    async getAbandonedCartProducts(limit = 10) {
        const addRows = await this.eventRepo
            .createQueryBuilder("event")
            .select("event.productId", "productId")
            .addSelect("COUNT(*)", "addCount")
            .where("event.eventType = :eventType", {
            eventType: AnalyticsEventType.ADD_TO_CART,
        })
            .andWhere("event.productId IS NOT NULL")
            .groupBy("event.productId")
            .getRawMany();
        const purchaseRows = await this.orderInventoryRepo
            .createQueryBuilder("oi")
            .select("inv.productId", "productId")
            .addSelect("COALESCE(SUM(oi.quantity), 0)", "purchasedCount")
            .innerJoin("oi.inventory", "inv")
            .innerJoin("oi.order", "order")
            .where("order.orderStatus IN (:...soldStatuses)", {
            soldStatuses: soldOrderStatuses,
        })
            .andWhere("inv.productId IS NOT NULL")
            .groupBy("inv.productId")
            .getRawMany();
        const purchasedMap = new Map(purchaseRows.map((row) => [Number(row.productId), Number(row.purchasedCount)]));
        const merged = addRows
            .map((row) => {
            const productId = Number(row.productId);
            const addCount = Number(row.addCount);
            const purchasedCount = purchasedMap.get(productId) || 0;
            const abandonmentRate = addCount > 0
                ? Math.round(((addCount - purchasedCount) / addCount) * 100)
                : 0;
            return { productId, addCount, purchasedCount, abandonmentRate };
        })
            .sort((a, b) => b.addCount - a.addCount)
            .slice(0, limit);
        if (merged.length === 0)
            return [];
        const products = await this.productRepo.find({
            where: { id: In(merged.map((m) => m.productId)) },
            relations: ["mainImage"],
        });
        const productMap = new Map(products.map((p) => [p.id, p]));
        return merged.map((m) => ({
            ...m,
            productName: productMap.get(m.productId)?.name || `محصول ${m.productId}`,
            imagePath: productMap.get(m.productId)?.mainImage?.filePath || null,
        }));
    }
    async getTopSearchQueries(dateRange = {}, limit = 10) {
        const rows = await this.applyDateRange(this.eventRepo
            .createQueryBuilder("event")
            .select("event.searchQuery", "searchQuery")
            .addSelect("COUNT(*)", "count")
            .where("event.eventType = :eventType", {
            eventType: AnalyticsEventType.SEARCH,
        })
            .andWhere("event.searchQuery IS NOT NULL"), dateRange)
            .groupBy("event.searchQuery")
            .orderBy('"count"', "DESC")
            .limit(limit)
            .getRawMany();
        return rows.map((row) => ({
            searchQuery: row.searchQuery,
            count: Number(row.count),
        }));
    }
}
export default new AnalyticsService();
