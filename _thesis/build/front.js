// Front matter: cover, bismillah, dedication, acknowledgments, Persian + English abstracts
const {
  Paragraph, TextRun, Table, TableRow, TableCell, AlignmentType,
  WidthType, BorderStyle, ShadingType, PageBreak,
} = require("docx");
const H = require("./helpers");

const PB = "\u3010"; // 【
const PE = "\u3011"; // 】

// ---------- cover ----------
function infoTable(rows) {
  return new Table({
    visuallyRightToLeft: true,
    width: { size: 62, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: H.NO_BORDERS,
    rows: rows.map(([label, value]) => new TableRow({
      cantSplit: true,
      children: [
        new TableCell({
          width: { size: 32, type: WidthType.PERCENTAGE },
          borders: { top: H.NB, left: H.NB, right: H.NB, bottom: H.NB },
          margins: { left: 120, right: 120 },
          children: [new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.LEFT,
            spacing: { line: 400, lineRule: "atLeast" },
            children: [H.faRun(label + ":", { bold: true, size: 26 })],
          })],
        }),
        new TableCell({
          width: { size: 68, type: WidthType.PERCENTAGE },
          borders: { top: H.NB, left: H.NB, right: H.NB, bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" } },
          margins: { left: 120, right: 120 },
          children: [new Paragraph({
            bidirectional: true,
            alignment: AlignmentType.CENTER,
            spacing: { line: 400, lineRule: "atLeast" },
            children: [H.faRun(value, { size: 26 })],
          })],
        }),
      ],
    })),
  });
}

function buildCover() {
  const line = (pt) => Math.ceil(pt * 23);
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 900, after: 160, line: line(22), lineRule: "atLeast" },
      children: [H.faRun("بسم‌الله الرحمن الرحیم", { bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 600, after: 120, line: line(22), lineRule: "atLeast" },
      children: [H.faRun(PB + "نام دانشگاه" + PE, { bold: true, size: 36 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 700, line: line(16), lineRule: "atLeast" },
      children: [H.faRun("دانشکده " + PB + "نام دانشکده" + PE, { size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 260, line: line(15), lineRule: "atLeast" },
      children: [H.faRun("پایان‌نامه کارشناسی", { size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 60, line: line(18), lineRule: "atLeast" },
      children: [H.faRun("طراحی و پیاده‌سازی فروشگاه اینترنتی", { bold: true, size: 32 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 160, line: line(18), lineRule: "atLeast" },
      children: [H.faRun("محصولات سرامیکی مبتنی بر فناوری‌های وب", { bold: true, size: 32 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { after: 200, line: line(14), lineRule: "atLeast" },
      children: [H.faRun("مطالعه موردی: فروشگاه اینترنتی الوی‌شاپ (EleviShop)", { size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 700, line: line(13), lineRule: "atLeast" },
      children: [H.enRun("Design and Implementation of an Online Store for Ceramic Products: A Case Study of EleviShop", { size: 24, italics: true })],
    }),
    infoTable([
      ["استاد راهنما", PB + "نام استاد راهنما" + PE],
      ["استاد مشاور", PB + "نام استاد مشاور" + PE],
      ["نگارنده", PB + "نام و نام خانوادگی دانشجو" + PE],
      ["شماره دانشجویی", PB + "شماره دانشجویی" + PE],
      ["رشته تحصیلی", PB + "رشته تحصیلی" + PE],
    ]),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 800, line: line(16), lineRule: "atLeast" },
      children: [H.faRun("شهریور ۱۴۰۵", { size: 28 })],
    }),
  ];
}

// ---------- bismillah page (own unnumbered page) ----------
function buildBismillah() {
  return [
    new Paragraph({ spacing: { before: 5400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { line: 600, lineRule: "atLeast" },
      children: [H.faRun("بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِیمِ", { bold: true, size: 44 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 300, line: 380 },
      children: [H.faRun("«وَ قُلِ اعْمَلُوا فَسَیَرَى اللهُ عَمَلَکُمْ وَ رَسُولُهُ وَ الْمُؤْمِنُونَ»", { size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 100, line: 340 },
      children: [H.faRun("سوره توبه، آیه ۱۰۵", { size: 22 })],
    }),
  ];
}

// ---------- dedication ----------
function buildDedication() {
  return [
    H.fmTitleFirst("تقدیم"),
    new Paragraph({ spacing: { before: 2400 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { line: 480, lineRule: "atLeast" },
      children: [H.faRun("تقدیم به پدر و مادر عزیزم؛", { bold: true, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 200, line: 400 },
      children: [H.faRun("که چراغ راهم بودند و همواره پشتیبان بی‌دریغم؛", { size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 200, line: 400 },
      children: [H.faRun("و به همه استادانی که دانش خود را بی‌امان به من آموختند.", { size: 26 })],
    }),
  ];
}

// ---------- acknowledgments ----------
function buildAcknowledgments() {
  return [
    H.fmTitle("سپاسگزاری"),
    H.p("برگزاری شایسته هر پژوهشی، افزون بر تلاش فردی پژوهنده، مرهون مساعدت‌های استادان راهنما و مشاور و بهره‌گیری از تجربه‌های پیشکسوتان هر حوزه است. بدین‌وسیله از استاد راهنمای گران‌قدر، جناب " + PB + "نام استاد راهنما" + PE + " که با رهنمودهای دلسوزانه، دقت نظر و حمایت‌های پیوسته خویش، مسیر انجام این پایان‌نامه را هموار ساختند، صمیمانه سپاسگزاری می‌شود. همچنین از استاد مشاور محترم، جناب " + PB + "نام استاد مشاور" + PE + " که با پیشنهادهای سنجیده خود به غنای این پژوهش افزودند، قدردانی می‌گردد."),
    H.p("گفتنی است داوری‌های ارزشمند استادان محترم گروه و جناب " + PB + "نام داور" + PE + " که در چاپ و دفاع این اثر راهگشا بود، بی‌تأثیر نبوده است؛ از ایشان نیز تشکر می‌شود."),
    H.p("در پایان از خانواده معزز خود که در طول دوره تحصیل، صبر و پشتیبانی‌شان را از من دریغ نکردند، سپاسگزارم و از یکایک دوستانی که در بهبود کیفیت این پژوهش یارای من بودند، تشکر می‌کنم."),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 600 },
      children: [H.faRun(PB + "نام و نام خانوادگی دانشجو" + PE, { bold: true, size: 26 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      bidirectional: true,
      spacing: { before: 60 },
      children: [H.faRun("شهریور ۱۴۰۵", { size: 24 })],
    }),
  ];
}

// ---------- Persian abstract ----------
function buildAbstractFa() {
  return [
    H.fmTitle("چکیده"),
    H.p("گسترش تجارت الکترونیک، فروش اقلام مصرفی و خانگی را نیز به‌طور گسترده به بستر اینترنت منتقل کرده است؛ با این حال، فروش محصولات سرامیکی و ظروف آشپزخانه به دلیل تنوع قالب، اندازه، طرح و رنگ، نیازمند مدل‌سازی تخصصی‌تری از محصول نسبت به فروشگاه‌های عمومی است. پژوهش حاضر به طراحی و پیاده‌سازی یک فروشگاه اینترنتی تمام‌عیار برای محصولات سرامیکی با عنوان «الوی‌شاپ» می‌پردازد که مهم‌ترین دستاورد آن، مدل سه‌مرحله‌ای انتخاب محصول بر پایه قالب، اندازه و طرح، و سازوکار فروش «سرویس» به‌صورت باندل متشکل از چند بشقاب با رنگ مشترک است. در این سامانه، اندازه محصول از سطح محصول به سطح ردیف انبار منتقل شده و قیمت‌گذاری و ظرفیت قابل فروش هر سرویس، بر مبنای موجودی قطعات تشکیل‌دهنده آن به‌صورت پویا محاسبه می‌شود. توسعه سامانه با معماری سه‌لایه و رویکرد چابک انجام شده است؛ لایه ارائه با React 18 به‌صورت اپلیکیشن تک‌صفحه‌ای راست‌به‌چپ، لایه منطق کسب‌وکار با Node.js و چارچوب Express به زبان TypeScript و لایه داده با پایگاه داده رابطه‌ای PostgreSQL و نگاشت اشیای رابطه‌ای TypeORM پیاده‌سازی شده است. ثبت سفارش در قالب یک تراکنش اتمیک با گسترش خودکار اقلام سرویس به قطعات تشکیل‌دهنده و ثبت دفتر کل حرکات انبار صورت می‌پذیرد. ارزیابی سامانه نشان می‌دهد که نیازمندی‌های کارکردی تعریف‌شده شامل کاتالوگ سه‌مرحله‌ای، سبد خرید همگام‌شونده، ثبت سفارش تراکنشی، مدیریت انبار و پنل مدیریت تحقق یافته است و بهینه‌سازی‌های انجام‌شده در بارگذاری صفحات و تصاویر، تجربه کاربری روانی را فراهم می‌آورد."),
    new Paragraph({
      bidirectional: true,
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 240, line: 360 },
      children: [
        H.faRun("واژگان کلیدی: ", { bold: true }),
        H.faRun("تجارت الکترونیک، فروشگاه اینترنتی، محصولات سرامیکی، React، Node.js، PostgreSQL، معماری سه‌لایه"),
      ],
    }),
  ];
}

// ---------- English abstract ----------
function buildAbstractEn() {
  const en = (t, o = {}) => new Paragraph({
    alignment: AlignmentType.JUSTIFIED,
    spacing: { line: 360, after: 120 },
    children: [H.enRun(t, o)],
  });
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 360, line: 500, lineRule: "atLeast" },
      pageBreakBefore: true,
      children: [H.enRun("Abstract", { bold: true, size: 32 })],
    }),
    en("The expansion of electronic commerce has moved the retail of household goods to the web at a large scale; nevertheless, selling ceramic products requires a more specialized product model than ordinary online stores, due to the variety of molds, sizes, patterns, and colors. This thesis presents the design and implementation of a full-stack online store for ceramic products, called EleviShop. Its main contribution is a three-step product selection model based on mold, size, and pattern, together with a bundle-sale mechanism in which a dinnerware set is sold as a group of plates sharing a common color. In this system, the size attribute has been migrated from the product level to the inventory level, and the price and sellable capacity of each set are dynamically computed from the stock of its component plates. The system is developed with a three-tier architecture and an iterative agile process: the presentation layer is a right-to-left single-page application built with React 18; the business layer is implemented in TypeScript on Node.js with the Express framework; and the data layer relies on PostgreSQL with TypeORM object-relational mapping. Order placement is performed as an atomic database transaction that automatically expands set items into their component plates and records a stock-movement ledger. The evaluation shows that all defined functional requirements - the three-step catalog, the synchronized shopping cart, transactional order placement, warehouse management, and the administration panel - have been fulfilled, and the applied optimizations provide a smooth user experience."),
    new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { before: 240, line: 360 },
      children: [
        H.enRun("Keywords: ", { bold: true }),
        H.enRun("Electronic Commerce, Online Store, Ceramic Products, React, Node.js, PostgreSQL, Three-Tier Architecture"),
      ],
    }),
  ];
}

module.exports = { buildCover, buildBismillah, buildDedication, buildAcknowledgments, buildAbstractFa, buildAbstractEn };
