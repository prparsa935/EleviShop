import { Router } from "express";

import analyticsController, {
  simpleRateLimiter,
} from "../controllers/analyticsController.js";
import authController from "../controllers/authController.js";

const analyticsApi = Router();

// عمومی: بدون نیاز به لاگین (کاربر مهمان هم می‌تواند رویداد ثبت کند) + rate limit ساده
// NOTE: bind ضروری است چون track داخلش از this استفاده می‌کند و به‌صورت callback پاس داده می‌شود.
// اگر بعداً express-rate-limit نصب شد، simpleRateLimiter را با آن جایگزین کنید.
analyticsApi.post(
  "/track",
  simpleRateLimiter,
  analyticsController.track.bind(analyticsController)
);

// محافظت‌شده: فقط ادمین
analyticsApi.get(
  "/dashboard",
  authController.authorizeUser,
  authController.isAdmin,
  analyticsController.dashboard.bind(analyticsController)
);

export default analyticsApi;
