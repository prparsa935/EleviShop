import rateLimit from "express-rate-limit";
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "تعداد تلاش‌ها بیش از حد مجاز است. لطفا ۱۵ دقیقه دیگر تلاش کنید",
    },
});
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 110,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "تعداد درخواست‌ها بیش از حد مجاز است. لطفا بعدا تلاش کنید",
    },
});
export { authLimiter, generalLimiter };
