// منابع + پیوست‌ها + فهرست جداول و اشکال
const { Paragraph, AlignmentType } = require("docx");
const H = require("./helpers");
const PAGES = require("./listpages");

const fa = (n) => String(n).replace(/\d/g, d => "۰۱۲۳۴۵۶۷۸۹"[d]);

// ---------- references ----------
const REFS = [
  "[1] I. Sommerville, Software Engineering, 10th ed. Harlow, England: Pearson Education, 2016.",
  "[2] R. S. Pressman and B. R. Maxim, Software Engineering: A Practitioner's Approach, 9th ed. New York, NY: McGraw-Hill Education, 2020.",
  "[3] R. T. Fielding, \"Architectural Styles and the Design of Network-based Software Architectures,\" Ph.D. dissertation, University of California, Irvine, CA, USA, 2000.",
  "[4] M. Fowler, Patterns of Enterprise Application Architecture. Boston, MA: Addison-Wesley, 2002.",
  "[5] R. C. Martin, Clean Architecture: A Craftsman's Guide to Software Structure and Design. Indianapolis, IN: Prentice Hall, 2017.",
  "[6] M. Jones, J. Bradley, and N. Sakimura, \"JSON Web Token (JWT),\" IETF RFC 7519, May 2015.",
  "[7] OWASP Foundation, \"OWASP Top 10:2021,\" 2021. [Online]. Available: https://owasp.org/Top10/",
  "[8] OpenJS Foundation, \"Node.js Documentation,\" [Online]. Available: https://nodejs.org/en/docs",
  "[9] OpenJS Foundation, \"Express 4.x API Reference,\" [Online]. Available: https://expressjs.com/en/4x/api.html",
  "[10] Microsoft, \"The TypeScript Handbook,\" [Online]. Available: https://www.typescriptlang.org/docs/handbook/",
  "[11] TypeORM, \"TypeORM Documentation,\" [Online]. Available: https://typeorm.io/",
  "[12] The PostgreSQL Global Development Group, \"PostgreSQL 16 Documentation,\" [Online]. Available: https://www.postgresql.org/docs/",
  "[13] Meta Open Source, \"React Documentation,\" [Online]. Available: https://react.dev/",
  "[14] VoidZero, \"Vite Guide,\" [Online]. Available: https://vite.dev/guide/",
  "[15] Tailwind Labs, \"Tailwind CSS Documentation,\" [Online]. Available: https://tailwindcss.com/docs",
];

function buildReferences() {
  const out = [H.h1("منابع")];
  for (const r of REFS) {
    out.push(new Paragraph({
      alignment: AlignmentType.LEFT,
      indent: { left: 700, hanging: 700 },
      spacing: { line: 340, after: 120 },
      children: [H.enRun(r, { size: 22 })],
    }));
  }
  return out;
}

// ---------- list of tables / figures ----------
function buildTableList() {
  const T = PAGES.tables;
  return [
    H.fmTitleFirst("فهرست جداول"),
    H.listOf([
      { no: "جدول " + fa("2-1"), title: "مقایسه کیفی رندر سمت سرور و اپلیکیشن تک‌صفحه‌ای", page: T["2-1"] },
      { no: "جدول " + fa("2-2"), title: "فناوری‌های به‌کاررفته و نقش آن‌ها در سامانه", page: T["2-2"] },
      { no: "جدول " + fa("3-1"), title: "نیازمندی‌های کارکردی سامانه", page: T["3-1"] },
      { no: "جدول " + fa("3-2"), title: "نیازمندی‌های غیرکارکردی سامانه", page: T["3-2"] },
      { no: "جدول " + fa("3-3"), title: "موجودیت‌های حوزه محصول و انبار", page: T["3-3"] },
      { no: "جدول " + fa("3-4"), title: "موجودیت‌های حوزه کاربر، سفارش و پشتیبانی", page: T["3-4"] },
      { no: "جدول " + fa("3-5"), title: "وضعیت‌های ممکن سفارش", page: T["3-5"] },
      { no: "جدول " + fa("3-6"), title: "انواع حرکت انبار در دفتر کل", page: T["3-6"] },
      { no: "جدول " + fa("4-1"), title: "سازوکارهای امنیتی پیاده‌سازی‌شده", page: T["4-1"] },
      { no: "جدول " + fa("4-2"), title: "سازوکارهای بهینه‌سازی عملکرد", page: T["4-2"] },
      { no: "جدول " + fa("5-1"), title: "سناریوهای آزمون پذیرش و نتیجه مشاهده‌شده", page: T["5-1"] },
    ], "جدول"),
  ];
}

function buildFigureList() {
  const F = PAGES.figures;
  return [
    H.fmTitle("فهرست اشکال"),
    H.listOf([
      { no: "شکل " + fa("2-1"), title: "معماری سه‌لایه کاربردهای وب", page: F["2-1"] },
      { no: "شکل " + fa("3-1"), title: "معماری کلی سامانه الوی‌شاپ", page: F["3-1"] },
      { no: "شکل " + fa("3-2"), title: "نمودار موجودیت-رابطه حوزه محصول و انبار (الف)", page: F["3-2a"] },
      { no: "شکل " + fa("3-2"), title: "نمودار موجودیت-رابطه حوزه سفارش و کاربر (ب)", page: F["3-2b"] },
      { no: "شکل " + fa("3-3"), title: "مدل‌سازی قالب، اندازه و طرح و پیوند آن با انبار", page: F["3-3"] },
      { no: "شکل " + fa("3-4"), title: "فرایند ثبت سفارش و گسترش اقلام سرویس", page: F["3-4"] },
      { no: "شکل " + fa("4-1"), title: "جریان همگام‌سازی سبد خرید میان کلاینت و سرور", page: F["4-1"] },
      { no: "شکل " + fa("5-1"), title: "قیف تبدیل در ماژول تحلیل رفتار کاربران", page: F["5-1"] },
    ], "شکل"),
  ];
}

// ---------- appendix A: API routes ----------
function buildAppendixA() {
  return [
    H.h1("پیوست الف: شرح تفصیلی مسیرهای رابط برنامه‌نویسی"),
    H.p("جدول الف-۱ گروه‌های سیزده‌گانه رابط برنامه‌نویسی سامانه و مسیرهای اصلی هر گروه را نشان می‌دهد. تمام مسیرها زیر پیشوند /api سرو می‌شوند و مسیرهای مدیریتی نیازمند نقش مدیر هستند."),
    H.tableCaption("جدول الف-۱: گروه‌های مسیر رابط برنامه‌نویسی و مسیرهای اصلی"),
    H.t3({
      widths: [20, 44, 36],
      header: ["گروه مسیر", "مسیرهای اصلی", "شرح"],
      aligns: [AlignmentType.CENTER, AlignmentType.RIGHT, AlignmentType.JUSTIFIED],
      rows: [
        ["/auth", "POST /login، POST /verify", "درخواست و تأیید رمز یک‌بارمصرف و صدور توکن"],
        ["/product", "GET /، GET /id/:id، GET /pattern/:id، POST /set/calc-price و مسیرهای admin", "جست‌وجوی صفحه‌بندی‌شده، جزئیات محصول و طرح، محاسبه پیش‌نمایش سرویس و مدیریت محصول"],
        ["/category", "GET /، GET /id/:id و مسیرهای admin", "درخت دسته‌بندی و مدیریت دسته‌ها"],
        ["/color", "GET /، GET /findBy و مسیرهای admin", "فهرست و مدیریت رنگ‌ها"],
        ["/mold", "GET /، GET /patterns، POST /admin/size و ...", "مدیریت قالب‌ها، اندازه‌ها، طرح‌ها و ترکیب قالب-طرح"],
        ["/productSet", "GET /:id", "جزئیات سرویس و رنگ‌های مشترک موجود"],
        ["/cart", "GET /، POST /sync", "بازخوانی و همگام‌سازی سبد خرید کاربر واردشده"],
        ["/order", "GET /current، GET /counts، GET /id/:id، POST /save", "ثبت سفارش و مشاهده سفارش‌های جاری، تحویل‌شده و لغوشده"],
        ["/person", "POST /save، GET /", "ثبت و مشاهده اطلاعات هویتی و نشانی"],
        ["/comment", "GET /product/:productId، POST /product/:productId/save", "دیدگاه‌ها، آمار امتیاز و ثبت دیدگاه"],
        ["/stock", "POST /adjust، GET /movements/:id، GET /low-stock، GET /slow-moving", "اصلاح موجودی، تاریخچه حرکات و گزارش‌های مدیریتی"],
        ["/analytics", "POST /track، GET /dashboard", "ثبت رویداد رفتاری و داده‌های داشبورد مدیر"],
        ["/image", "POST /upload", "آپلود تصویر با صافی نوع و حجم"],
      ],
    }),
  ];
}

// ---------- appendix B: run guide ----------
function buildAppendixB() {
  return [
    H.h1("پیوست ب: راهنمای راه‌اندازی و اجرای پروژه"),
    H.p("برای راه‌اندازی سامانه در محیط توسعه، پیش‌نیازها و گام‌های زیر لازم است."),
    H.h2("ب-۱- پیش‌نیازها"),
    H.li("۱. Node.js نسخه ۲۰ یا بالاتر و مدیریت بسته npm؛"),
    H.li("۲. PostgreSQL نسخه ۱۴ یا بالاتر با یک پایگاه داده خالی (پیش‌فرض نام elevi)؛"),
    H.li("۳. تنظیم متغیرهای محیطی در فایل backend/.env شامل DB_HOST، DB_PORT، DB_USERNAME، DB_PASSWORD، DB_NAME، SECRET_TOKEN_KEY و FRONTEND_URL.", { after: 120 }),
    H.h2("ب-۲- گام‌های اجرا"),
    H.li("۱. نصب وابستگی‌های سمت سرور و سمت کاربر با اجرای دستور npm install در پوشه‌های backend و frontend؛"),
    H.li("۲. ایجاد و پرکردن داده اولیه نمونه با اجرای اسکریپت node scripts/seed-data.js در پوشه backend؛"),
    H.li("۳. اجرای سرور توسعه با دستور npm run dev در پوشه backend (پیش‌فرض درگاه ۸۰۰۰)؛"),
    H.li("۴. اجرای رابط کاربری با دستور npm run dev در پوشه frontend و بازکردن نشانی محلی نمایش‌داده‌شده؛"),
    H.li("۵. برای استقرار نهایی، ساخت نسخه تولیدی رابط کاربر با npm run build و سرو‌شدن آن به‌صورت ایستا توسط همان سرور Express.", { after: 120 }),
    H.h2("ب-۳- اسکریپت‌های کمکی"),
    H.p("اسکریپت seed-data.js جدول‌ها را بازسازی و داده نمونه واقع‌نما (دسته‌ها، قالب‌ها، اندازه‌ها، طرح‌ها، محصولات، سرویس‌ها، انبار، سفارش‌ها و رویدادها) ایجاد می‌کند. اسکریپت migrate-mold-data.ts مهاجرت ساختار قالب/اندازه/طرح و ستون‌های اندازه در انبار را انجام می‌دهد و اسکریپت compress-images.js با کتابخانه sharp تصاویر عمومی را با بیشینه عرض ۱۹۲۰ پیکسل و کیفیت ۷۸ بازکدگذاری می‌کند؛ این اسکریپت از پرچم dry-run نیز پشتیبانی می‌کند."),
  ];
}

module.exports = { buildReferences, buildTableList, buildFigureList, buildAppendixA, buildAppendixB };
