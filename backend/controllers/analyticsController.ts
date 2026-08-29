import { Request, Response } from "express";

import ResponseDTO from "../dtos/response.dto.js";
import analyticsService, {
  AnalyticsDateRange,
} from "../services/analyticsService.js";
import { AnalyticsEventType } from "../models/AnalyticsEvent.js";
import authService from "../services/authService.js";
import userService from "../services/userService.js";
import { User } from "../models/User.js";

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 120;
const rateLimitStore = new Map<string, number[]>();

/**
 * Rate limit ساده در-memory برای /track (بدون نیاز به dependency).
 * NOTE: برای production بهتر است پکیج express-rate-limit با store اشتراکی
 * (مثل Redis) جایگزین شود؛ نقطه‌ی تعویض دقیقاً همین middleware است.
 */
const simpleRateLimiter = (req: Request, res: Response, next: Function) => {
  try {
    const key = (req.body?.sessionId as string) || req.ip || "unknown";
    const now = Date.now();
    const timestamps = (rateLimitStore.get(key) || []).filter(
      (t) => now - t < RATE_LIMIT_WINDOW_MS
    );
    if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
      return res
        .status(429)
        .json(
          new ResponseDTO(
            null,
            { message: "تعداد درخواست‌ها بیش از حد مجاز است" },
            false
          )
        );
    }
    timestamps.push(now);
    rateLimitStore.set(key, timestamps);
    if (rateLimitStore.size > 10000) {
      for (const [k, ts] of rateLimitStore) {
        if (ts.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) {
          rateLimitStore.delete(k);
        }
      }
    }
    next();
  } catch {
    next();
  }
};

class AnalyticsController {
  /**
   * تشخیص اختیاری کاربر لاگین‌شده — برای مهمان undefined برمی‌گردد و
   * هیچ خطایی تولید نمی‌کند (برخلاف authorizeUser که 403 می‌دهد).
   */
  private async resolveOptionalUser(req: Request): Promise<User | undefined> {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) return undefined;
      const tokenUser = authService.verifyToken(authHeader.split(" ")[1]);
      if (!tokenUser) return undefined;
      return (
        (await userService.findUserByPhoneNumber(tokenUser.phoneNumber)) ||
        undefined
      );
    } catch {
      return undefined;
    }
  }

  /** POST /api/analytics/track — عمومی، بدون نیاز به لاگین */
  async track(req: Request, res: Response) {
    try {
      const body = req.body || {};
      const eventType = body.eventType;
      if (!Object.values(AnalyticsEventType).includes(eventType)) {
        // رویداد نامعتبر: بی‌صدا نادیده گرفته می‌شود
        return res.status(200).json(new ResponseDTO(null, null, true));
      }
      const user = await this.resolveOptionalUser(req);
      const sessionId =
        typeof body.sessionId === "string" && body.sessionId.length > 0
          ? body.sessionId.slice(0, 64)
          : "anonymous";

      await analyticsService.trackEvent(
        {
          eventType,
          sessionId,
          productId: Number(body.productId) || null,
          categoryId: Number(body.categoryId) || null,
          searchQuery: body.searchQuery ? String(body.searchQuery) : null,
          metadata:
            body.metadata && typeof body.metadata === "object"
              ? body.metadata
              : null,
        },
        user
      );
      return res.status(200).json(new ResponseDTO(null, null, true));
    } catch (error) {
      // ثبت آنالیتیکس هیچ‌وقت نباید کلاینت را با خطا بشکند
      return res.status(200).json(new ResponseDTO(null, null, true));
    }
  }

  /** GET /api/analytics/dashboard — محافظت‌شده (authorizeUser + isAdmin در routes) */
  async dashboard(req: Request, res: Response) {
    try {
      const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
      const groupBy = req.query.groupBy === "week" ? "week" : "day";
      const dateRange: AnalyticsDateRange = {
        from: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
      };

      const [
        eventCounts,
        funnel,
        salesOverTime,
        mostViewedProducts,
        abandonedCartProducts,
        topSearchQueries,
      ] = await Promise.all([
        analyticsService.countEvents(Object.values(AnalyticsEventType), dateRange),
        analyticsService.getConversionFunnel(dateRange),
        analyticsService.getSalesOverTime(dateRange, groupBy),
        analyticsService.getMostViewedProducts(dateRange, 10),
        analyticsService.getAbandonedCartProducts(10),
        analyticsService.getTopSearchQueries(dateRange, 10),
      ]);

      const productViews = eventCounts[AnalyticsEventType.PRODUCT_VIEW] || 0;
      const purchases = eventCounts[AnalyticsEventType.PURCHASE_COMPLETE] || 0;
      const conversionRate =
        productViews > 0
          ? Math.round((purchases / productViews) * 10000) / 100
          : 0;

      return res.status(200).json(
        new ResponseDTO(null, null, true, null, {
          rangeDays: days,
          totals: {
            productViews,
            addToCarts: eventCounts[AnalyticsEventType.ADD_TO_CART] || 0,
            removeFromCarts: eventCounts[AnalyticsEventType.REMOVE_FROM_CART] || 0,
            searches: eventCounts[AnalyticsEventType.SEARCH] || 0,
            categoryViews: eventCounts[AnalyticsEventType.CATEGORY_VIEW] || 0,
            checkoutStarts: eventCounts[AnalyticsEventType.CHECKOUT_START] || 0,
            purchases,
            conversionRate,
          },
          funnel,
          salesOverTime,
          mostViewedProducts,
          abandonedCartProducts,
          topSearchQueries,
        })
      );
    } catch (error) {
      return res
        .status(500)
        .json(new ResponseDTO(null, { message: "خطای درون سروری" }, false));
    }
  }
}
export default new AnalyticsController();
export { simpleRateLimiter };
