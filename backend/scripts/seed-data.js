/**
 * Full database reset + realistic seed for EleVi shop.
 * - wipes every data entity (users/persons of real accounts are kept so the
 *   admin login keeps working)
 * - copies photos from the zarpharo photos folder into backend/public/seed
 * - creates a single-root category tree (the shop menu is rendered from the
 *   first root category, so everything must live under one root)
 * - creates molds + sizes + patterns + mold-pattern combos, plate products
 *   grouped by combo, product sets built from plates, inventories, comments,
 *   orders, stock movements, analytics events and cart items
 *
 * run: node scripts/seed-data.js
 */
import pkg from "pg";
import fs from "fs";
import path from "path";
const { Client } = pkg;

const PHOTOS_DIR = "F:\\projects\\zarpharo\\zarpharo\\backend\\photos";
const PUBLIC_SEED_DIR = path.resolve("public/seed");

const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "Yecg@@48255",
  database: process.env.DB_NAME || "elevi",
});

const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;
const daysAgo = (d) => new Date(Date.now() - d * 86400000 - rnd(0, 20) * 3600000);
const sessionId = () => [...crypto.getRandomValues(new Uint8Array(16))].map(b => b.toString(16).padStart(2, "0")).join("");

async function copyPhotos() {
  fs.mkdirSync(PUBLIC_SEED_DIR, { recursive: true });
  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
    .sort();
  const filePaths = [];
  let i = 1;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    const target = `p${String(i).padStart(3, "0")}${ext}`;
    fs.copyFileSync(path.join(PHOTOS_DIR, file), path.join(PUBLIC_SEED_DIR, target));
    filePaths.push(`seed/${target}`);
    i++;
  }
  return filePaths;
}

async function wipe() {
  // OTP state would block truncating tf_login through user.tfLoginId, so rows
  // are deleted row-by-row after the reference is dropped
  await client.query('UPDATE "user" SET "tfLoginId" = NULL');
  const tables = [
    "analytics_event",
    "stock_movement",
    "user_comment_likes",
    "comment",
    "order_inventory",
    '"order"',
    "shopping_cart_item",
    "product_set_item",
    "inventory",
    "image",
    "product",
    "product_categories_category",
    "mold_pattern",
    "mold_size",
    "mold",
    "pattern",
    "category",
    "color",
    "base",
  ];
  for (const t of tables) {
    await client.query(`TRUNCATE TABLE ${t} RESTART IDENTITY CASCADE`);
  }
  await client.query("DELETE FROM tf_login");
  // widen the product text columns so realistic Persian copy fits
  // (matches the widened lengths in models/product.ts)
  await client.query(
    `ALTER TABLE product
       ALTER COLUMN name TYPE varchar(100),
       ALTER COLUMN description TYPE varchar(1000),
       ALTER COLUMN pattern TYPE varchar(50),
       ALTER COLUMN material TYPE varchar(50)`
  );
  // keep persons referenced by the surviving users, drop orphan profiles
  await client.query(
    'DELETE FROM person WHERE id NOT IN (SELECT "personId" FROM "user" WHERE "personId" IS NOT NULL)'
  );
  await client.query(
    'UPDATE person SET "firstName" = TRIM("firstName"), "lastName" = TRIM("lastName")'
  );
}

const SEED_USERS = [
  { phoneNumber: "09121770142", isSuperUser: true, firstName: "پارسا", lastName: "رجبی", address: "تهران، خیابان ولیعصر، پلاک ۱۲۰", postalCode: "1594773111" },
  { phoneNumber: "09026699723", isSuperUser: false, firstName: "سارا", lastName: "محمدی", address: "اصفهان، خیابان چهارباغ بالا، پلاک ۴۵", postalCode: "8158813111" },
  { phoneNumber: "09917637719", isSuperUser: false, firstName: "امیر", lastName: "کریمی", address: "شیراز، بلوار زند، ساختمان نگین", postalCode: "7134713111" },
];

// admin login must survive the reset: recreate the known accounts if the
// user table came back empty
async function ensureUsers() {
  let users = (await client.query('SELECT id, "personId" FROM "user" ORDER BY id')).rows;
  if (users.length > 0) return users;
  console.log("  recreating seed users…");
  for (const u of SEED_USERS) {
    const person = await client.query(
      'INSERT INTO person ("firstName", "lastName", "postalCode", "addressLine", "phoneNumber") VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [u.firstName, u.lastName, u.postalCode, u.address, u.phoneNumber]
    );
    const user = await client.query(
      'INSERT INTO "user" ("phoneNumber", "isSuperUser", "personId") VALUES ($1,$2,$3) RETURNING id',
      [u.phoneNumber, u.isSuperUser, person.rows[0].id]
    );
    users.push({ id: user.rows[0].id, personId: person.rows[0].id });
  }
  return users;
}

async function seedColors() {
  const colors = [
    ["#1CA9A9", "فیروزه‌ای"],
    ["#F5E6C8", "کرم صدفی"],
    ["#F8F8F6", "سفید مات"],
    ["#2C3E8C", "نیلی"],
    ["#4F6F46", "سبز خزه‌ای"],
    ["#E8C33F", "زرد لیمویی"],
    ["#C96F3B", "نارنجی آجری"],
    ["#6B4226", "قهوه‌ای شکلاتی"],
    ["#2B2B2B", "مشکی ذغالی"],
    ["#E8B4B8", "صورتی پودری"],
  ];
  const ids = [];
  for (const [hexCode, name] of colors) {
    const r = await client.query(
      'INSERT INTO color ("hexCode", name) VALUES ($1, $2) RETURNING id',
      [hexCode, name]
    );
    ids.push({ id: r.rows[0].id, name });
  }
  return ids;
}

async function seedCategories() {
  const tree = [
    ["بشقاب و دیس", [["بشقاب گرد"], ["دیس و ظرف سرو"]]],
    ["کاسه و پیاله", []],
    ["لیوان و استکان", []],
    ["سرویس غذاخوری", []],
    ["گلدان و ظرف تزئینی", []],
    ["قاب و تابلو سفال", []],
  ];
  const root = await client.query(
    "INSERT INTO category (name) VALUES ($1) RETURNING id",
    ["ظروف سفالی و سرامیک"]
  );
  const map = { "ظروف سفالی و سرامیک": root.rows[0].id };
  for (const [name, children] of tree) {
    const cat = await client.query(
      'INSERT INTO category (name, "parentCategoryId") VALUES ($1, $2) RETURNING id',
      [name, root.rows[0].id]
    );
    map[name] = cat.rows[0].id;
    for (const [childName] of children) {
      const child = await client.query(
        'INSERT INTO category (name, "parentCategoryId") VALUES ($1, $2) RETURNING id',
        [childName, cat.rows[0].id]
      );
      map[childName] = child.rows[0].id;
    }
  }
  return map;
}

const MOLDS = [
  { name: "بشقاب گرد ۲۰ سانت", shape: "گرد", base: 240000, category: "بشقاب گرد", dims: [[16, 3, 350], [20, 4, 520], [24, 5, 700]] },
  { name: "بشقاب گرد ۲۷ سانت", shape: "گرد", base: 380000, category: "بشقاب گرد", dims: [[24, 4, 700], [27, 5, 950]] },
  { name: "بشقاب چهارگوش ۲۵ سانت", shape: "مربع", base: 420000, category: "بشقاب گرد", dims: [[21, 4, 750], [25, 5, 1050]] },
  { name: "دیس سرو بیضی ۳۵ سانت", shape: "بیضی", base: 650000, category: "دیس و ظرف سرو", dims: [[30, 6, 1400], [35, 7, 1900]] },
  { name: "کاسه گود ۱۵ سانت", shape: "گرد", base: 210000, category: "کاسه و پیاله", dims: [[12, 6, 400], [15, 8, 620]] },
  { name: "پیاله لیمو ۹ سانت", shape: "گرد", base: 130000, category: "کاسه و پیاله", dims: [[9, 4, 180], [11, 5, 260]] },
  { name: "لیوان سفالی دسته‌دار", shape: "استوانه", base: 180000, category: "لیوان و استکان", dims: [[9, 10, 280], [11, 12, 360]] },
  { name: "گلدان کلاسیک ۳۰ سانت", shape: "کلاسیک", base: 520000, category: "گلدان و ظرف تزئینی", dims: [[18, 24, 1600], [22, 30, 2300]] },
];

const PATTERNS = [
  "طرح ترمه",
  "طرح ختایی",
  "طرح بته‌جقه",
  "طرح اسلیمی",
  "طرح انار",
  "طرح ماهی و دریا",
  "طرح گل محمدی",
  "طرح هندسه شکسته",
  "طرح لچک‌ترنج",
  "لعاب ساده",
];

const MATERIALS = ["سفال لعاب‌دار", "سرامیک دست‌ساز", "استون‌ویر", "سفال میناکاری"];

const DESCRIPTIONS = [
  "ظرفی با لعاب دست‌ساز و نقش‌مایه‌های اصیل ایرانی که با پخت دوم در کوره‌ی ۱۲۰۰ درجه، مقاومتی عالی در برابر حرارت و شوینده دارد. مناسب استفاده‌ی روزمره و نیز بخشیدن به‌عنوان هدیه.",
  "هر قطعه به‌صورت دستی در قالب ریخته و پس از سه مرحله پرداخت، با رنگ‌های مخصوص لعاب تزیین شده است. تفاوت جزئی در رنگ و نقش، نشانه‌ی اصالت دست‌ساز بودن محصول است.",
  "این محصول از خاک سفال مرغوب تهیه شده و با الهام از نقوش سنتی ایرانی طراحی شده است. قابل استفاده در ماشین ظرف‌شویی و مایکروویو، بدون آنکه از جلای لعاب آن کاسته شود.",
  "ترکیبی از هنر و کاربرد؛ سطح داخلی با لعاب شیشه‌ای پوشیده شده که شست‌وشوی آن را آسان می‌کند و لبه‌های نرم و گرد آن ایمنی استفاده را تضمین می‌کند.",
];

const SET_CONTAINS = [
  "شامل بشقاب اصلی، بشقاب گوشت، کاسه سوپ و پیاله ترشی به‌ازای هر نفر",
  "شامل بشقاب غذاخوری، پیش‌دستی و لیوان سفالی به‌ازای هر نفر به‌همراه یک دیس سرو",
  "شامل ۶ بشقاب گرد، ۶ کاسه گود و ۱ دیس بیضی سرو مرکزی",
  "شامل بشقاب، کاسه و استکان با نقش هماهنگ به‌ازای هر نفر",
];

const COMMENTS = [
  "کیفیت لعاب و رنگ واقعاً عالیه، دقیقاً همون چیزی بود که تو عکس‌ها دیدم.",
  "بسته‌بندی خیلی حرفه‌ای بود و بدون هیچ خرابی به دستم رسید. ممنون از فروشنده.",
  "طرح‌هاش فوق‌العاده شیک هستن، روی میز عید خیلی خوب شد.",
  "یه کم رنگش نسبت به عکس روشن‌تر بود ولی در کل راضی هستم.",
  "ارزش خریدش رو داره، دست‌ساز بودنش کاملاً معلومه و حس خوبی داره.",
  "سفارشم با تاخیر رسید ولی کیفیت جبرانش کرد، مخصوصاً لعابش خیلی مرغوبه.",
  "برای هدیه گرفتم و طرف خیلی خوشش اومد، جعبه‌ی مخصوص هم داشت.",
  "سایزش دقیقاً همونی بود که تو توضیحات نوشته شده بود. دقیق و تمیز.",
  "چند ماهه دارم استفاده می‌کنم، رنگش اصلاً نرفته و خط و خش نیفتاده.",
  "ظرف‌های سنگین و باکیفیتی هستن، خیلی وقته دنبال همچین کیفیتی بودم.",
  "قیمتش نسبت به کیفیت منصفانه است، پیشنهاد می‌کنم.",
  "طرح ترمه‌اش چشم‌نوازیه، کاش رنگ‌های بیشتری هم داشت.",
  "اولین خریدم از این فروشگاه بود و قطعاً تکرارش می‌کنم.",
  "لبه‌های ظرف کاملاً صاف و پرداخت شده بود، کیفیت ساخت بالا درجه‌ای داره.",
];

const SEARCH_QUERIES = [
  "بشقاب ترمه",
  "سرویس غذاخوری",
  "کاسه سفالی",
  "گلدان کلاسیک",
  "لیوان سفالی",
  "ظرف عید",
  "بشقاب چهارگوش",
  "پیاله",
];

const ANALYTICS_TYPES = [
  ["PRODUCT_VIEW", 0.5],
  ["CATEGORY_VIEW", 0.12],
  ["SEARCH", 0.1],
  ["ADD_TO_CART", 0.12],
  ["CHECKOUT_START", 0.08],
  ["PURCHASE_COMPLETE", 0.08],
];

function pickAnalyticsType() {
  const r = Math.random();
  let acc = 0;
  for (const [type, p] of ANALYTICS_TYPES) {
    acc += p;
    if (r <= acc) return type;
  }
  return "PRODUCT_VIEW";
}

async function insertImage(filePath) {
  const r = await client.query(
    "INSERT INTO image (\"filePath\") VALUES ($1) RETURNING id",
    [filePath]
  );
  return r.rows[0].id;
}

async function main() {
  console.log("connecting…");
  await client.connect();

  console.log("copying photos…");
  const photos = await copyPhotos();
  console.log(`  ${photos.length} photos copied to public/seed`);

  console.log("wiping tables…");
  await wipe();

  const users = await ensureUsers();
  console.log(`  ${users.length} users available (admin login preserved)`);

  const colors = await seedColors();
  console.log(`  ${colors.length} colors`);

  const categories = await seedCategories();
  console.log("  category tree created (single root)");

  // ---- image pool ----
  const imageIds = [];
  for (const fp of photos) imageIds.push(await insertImage(fp));
  console.log(`  ${imageIds.length} image rows`);

  // ---- molds + sizes ----
  const moldRows = [];
  for (const m of MOLDS) {
    const r = await client.query(
      "INSERT INTO mold (name, shape) VALUES ($1, $2) RETURNING id",
      [m.name, m.shape]
    );
    moldRows.push({ ...m, id: r.rows[0].id, sizes: [] });
    for (const [width, height, weight] of m.dims) {
      const label = m.dims.length === 1 ? "استاندارد" : (height === m.dims[0][1] ? "کوچک" : height === m.dims[m.dims.length - 1][1] ? "بزرگ" : "متوسط");
      const sr = await client.query(
        'INSERT INTO mold_size ("moldId", "sizeLabel", height, width, weight) VALUES ($1,$2,$3,$4,$5) RETURNING id',
        [r.rows[0].id, label, height, width, weight]
      );
      moldRows[moldRows.length - 1].sizes.push({
        id: sr.rows[0].id,
        label,
        sizeFactor: label === "کوچک" ? 0.75 : label === "بزرگ" ? 1.45 : 1,
      });
    }
  }
  console.log(`  ${moldRows.length} molds with sizes`);

  // ---- patterns ----
  const patternIds = [];
  for (const name of PATTERNS) {
    const r = await client.query(
      'INSERT INTO pattern (name, "previewImageId") VALUES ($1, $2) RETURNING id',
      [name, pick(imageIds)]
    );
    patternIds.push({ id: r.rows[0].id, name });
  }
  console.log(`  ${patternIds.length} patterns`);

  // ---- mold-pattern combos ----
  const combos = [];
  for (const mold of moldRows) {
    const shuffled = [...patternIds].sort(() => Math.random() - 0.5);
    const count = rnd(2, 3);
    for (const pattern of shuffled.slice(0, count)) {
      const r = await client.query(
        'INSERT INTO mold_pattern ("moldId", "patternId") VALUES ($1,$2) RETURNING id',
        [mold.id, pattern.id]
      );
      combos.push({ id: r.rows[0].id, mold, pattern });
    }
  }
  console.log(`  ${combos.length} mold-pattern combos`);

  // ---- plate products ----
  const plateProducts = []; // { id, colorIds: [], offPercent, minPrice }
  let codeSeq = 1000;
  let photoCursor = 0;
  const nextPhoto = () => imageIds[photoCursor++ % imageIds.length];

  for (const combo of combos) {
    const variants = chance(0.3) ? 2 : 1;
    for (let v = 0; v < variants; v++) {
      const name = `${combo.mold.name} ${combo.pattern.name}${v ? " - لعاب کریستالی" : ""}`;
      const code = `EL-${++codeSeq}`;
      const offPercent = chance(0.25) ? pick([10, 15, 20, 25, 30, 35]) : 0;
      const material = pick(MATERIALS);
      const gallery = [nextPhoto(), nextPhoto(), nextPhoto()];
      if (chance(0.4)) gallery.push(nextPhoto());

      const r = await client.query(
        `INSERT INTO product
           (type, name, code, description, "mainImageId", pattern, "offPercent",
            material, "mainCategoryId", "moldPatternId", "countPerProduct")
         VALUES ('plate', $1,$2,$3,$4,$5,$6,$7,$8,$9,1) RETURNING id`,
        [
          name,
          code,
          pick(DESCRIPTIONS),
          gallery[0],
          combo.pattern.name,
          offPercent,
          material,
          categories[combo.mold.category],
          combo.id,
        ]
      );
      const productId = r.rows[0].id;

      for (const imgId of gallery) {
        await client.query("UPDATE image SET \"productId\" = $1 WHERE id = $2", [productId, imgId]);
      }

      // inventories: every size × a rotating subset of colors
      const colorIds = [];
      for (const size of combo.mold.sizes) {
        const colorSubset = [colors[(codeSeq + size.id) % colors.length], colors[(codeSeq + size.id + 3) % colors.length], colors[(codeSeq + size.id + 6) % colors.length]];
        for (const color of colorSubset) {
          if (colorIds.includes(color.id)) continue;
          colorIds.push(color.id);
          const price = Math.round((combo.mold.base * size.sizeFactor * (0.9 + Math.random() * 0.35)) / 1000) * 1000;
          const quantity = chance(0.1) ? 0 : rnd(3, 40);
          await client.query(
            'INSERT INTO inventory (quantity, price, "productId", "colorId", "sizeId", "lowStockThreshold") VALUES ($1,$2,$3,$4,$5,5)',
            [quantity, price, productId, color.id, size.id]
          );
        }
      }
      plateProducts.push({ id: productId, colorIds, offPercent, name });
    }
  }
  console.log(`  ${plateProducts.length} plate products`);

  // ---- product sets ----
  const setProducts = [];
  for (let s = 0; s < 6; s++) {
    const anchorColor = pick(colors).id;
    const members = [];
    const memberPool = plateProducts.filter((p) => p.colorIds.includes(anchorColor));
    if (memberPool.length < 3) continue;
    const shuffledPool = [...memberPool].sort(() => Math.random() - 0.5);
    for (const candidate of shuffledPool) {
      if (members.length >= rnd(3, 4)) break;
      if (!members.some((m) => m.id === candidate.id)) members.push(candidate);
    }
    const quantities = members.map((_, i) => (i === 0 ? 6 : i === 1 ? 6 : 1));

    // same price rule as productSetService.computeCalculatedPriceFromPlateItems:
    // cheapest in-stock inventory per plate × per-set quantity
    let calculatedPrice = 0;
    for (let i = 0; i < members.length; i++) {
      const invs = (await client.query(
        'SELECT price FROM inventory WHERE "productId" = $1 AND quantity > 0',
        [members[i].id]
      )).rows;
      if (invs.length) calculatedPrice += Math.min(...invs.map((r) => r.price)) * quantities[i];
    }
    const manualPriceOverride = chance(0.5)
      ? Math.round((calculatedPrice * 0.93) / 1000) * 1000
      : null;
    const effectivePrice = manualPriceOverride ?? calculatedPrice;
    const name = `سرویس غذاخوری ${pick(["ترمه", "ختایی", "بته‌جقه", "انار", "اسلیمی", "گل محمدی"])} ${pick(["۴", "۶"])} نفره${s ? " " + ["دوروز", "نگین", "بهار", "یلدا", "شب‌چراغ", "حصار"][s] : ""}`;
    const code = `EL-${++codeSeq}`;
    const offPercent = chance(0.3) ? pick([5, 10, 15]) : 0;
    const gallery = [nextPhoto(), nextPhoto(), nextPhoto()];

    const r = await client.query(
      `INSERT INTO product
         (type, name, code, description, "mainImageId", pattern, "offPercent", material,
          "mainCategoryId", "countPerProduct", contain, "calculatedPrice", "manualPriceOverride")
       VALUES ('productSet', $1,$2,$3,$4,$5,$6,$7,$8,1,$9,$10,$11) RETURNING id`,
      [
        name,
        code,
        pick(DESCRIPTIONS),
        gallery[0],
        "لعاب ساده",
        offPercent,
        "سرویس سفالی دست‌ساز",
        categories["سرویس غذاخوری"],
        pick(SET_CONTAINS),
        calculatedPrice,
        manualPriceOverride,
      ]
    );
    const setId = r.rows[0].id;
    for (const imgId of gallery) {
      await client.query("UPDATE image SET \"productId\" = $1 WHERE id = $2", [setId, imgId]);
    }
    for (let i = 0; i < members.length; i++) {
      await client.query(
        'INSERT INTO product_set_item ("productSetId", "plateId", quantity) VALUES ($1,$2,$3)',
        [setId, members[i].id, quantities[i]]
      );
    }
    // the set's own inventories: one row per color shared by every member
    const commonColorIds = members.reduce(
      (acc, m) => acc.filter((c) => m.colorIds.includes(c)),
      [...members[0].colorIds]
    ).slice(0, 4);
    for (const colorId of commonColorIds.length ? commonColorIds : [anchorColor]) {
      await client.query(
        'INSERT INTO inventory (quantity, price, "productId", "colorId", "lowStockThreshold") VALUES ($1,$2,$3,$4,5)',
        [rnd(3, 15), Math.round(effectivePrice / 1000) * 1000, setId, colorId]
      );
    }
    setProducts.push({ id: setId, colorIds: commonColorIds.length ? commonColorIds : [anchorColor], offPercent, name });
  }
  console.log(`  ${setProducts.length} product sets`);

  const allProducts = [...plateProducts, ...setProducts];

  // ---- comments + product rate aggregates ----
  let commentCount = 0;
  for (const product of allProducts) {
    const n = rnd(0, 6);
    const rates = [];
    for (let i = 0; i < n; i++) {
      const rate = chance(0.15) ? 3 : pick([4, 5, 5, 5, 4]);
      rates.push(rate);
      const likes = rnd(0, 12);
      const dislikes = rnd(0, 3);
      const c = await client.query(
        'INSERT INTO comment (content, "productId", "userId", rate, "likesCount", "dislikesCount", "dateCreated") VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
        [pick(COMMENTS), product.id, pick(users).id, rate, likes, dislikes, daysAgo(rnd(1, 90))]
      );
      // a few reactions from the actual users behind the counts
      for (const u of users.slice(0, Math.min(users.length, rnd(0, 3)))) {
        if (chance(0.4)) {
          await client.query(
            'INSERT INTO user_comment_likes ("isLike", "userId", "commentId") VALUES ($1,$2,$3)',
            [chance(0.8), u.id, c.rows[0].id]
          );
        }
      }
      commentCount++;
    }
    const rateScore = rates.reduce((a, b) => a + b, 0);
    const avg = rates.length ? Math.round(rateScore / rates.length) : 0;
    await client.query(
      'UPDATE product SET rate = $1, "rateScore" = $2, "rateCount" = $3, "commentCount" = $4, "buyerCount" = $5 WHERE id = $6',
      [avg, rateScore, rates.length, rates.length, rnd(3, 80), product.id]
    );
  }
  console.log(`  ${commentCount} comments + rate aggregates`);

  // ---- orders ----
  const statuses = ["تحویل شده", "تحویل شده", "تحویل شده", "پرداخت تایید شده", "پرداخت تایید شده", "در حال ارسال", "در حال ارسال", "در انتظار پرداخت", "لغو شده"];
  const stockInventories = (await client.query(
    'SELECT i.id, i.price, i.quantity, i."productId", p."offPercent" FROM inventory i JOIN product p ON p.id = i."productId" WHERE i.quantity > 0'
  )).rows;
  const usedTracking = new Set();
  let orderCount = 0;
  for (let o = 0; o < 14; o++) {
    const user = pick(users);
    const status = pick(statuses);
    const date = daysAgo(rnd(1, 60));
    let tracking;
    do {
      tracking = `${date.toISOString().slice(0, 10).replace(/-/g, "")}${rnd(1000, 99999)}`;
    } while (usedTracking.has(tracking));
    usedTracking.add(tracking);
    const r = await client.query(
      'INSERT INTO "order" ("trackingCode", "orderStatus", "userId", "personId", "dateCreated") VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [tracking, status, user.id, user.personId, date]
    );
    const orderId = r.rows[0].id;
    const items = rnd(1, 3);
    const chosen = new Set();
    for (let i = 0; i < items; i++) {
      const inv = pick(stockInventories);
      if (chosen.has(inv.id)) continue;
      chosen.add(inv.id);
      const qty = rnd(1, 3);
      await client.query(
        'INSERT INTO order_inventory (quantity, "singleProductPrice", "singleProductOffPercent", "orderId", "inventoryId", "dateCreated") VALUES ($1,$2,$3,$4,$5,$6)',
        [qty, inv.price, inv.offPercent, orderId, inv.id, date]
      );
      if (["تحویل شده", "در حال ارسال", "پرداخت تایید شده"].includes(status)) {
        await client.query(
          'INSERT INTO stock_movement ("inventoryId", type, "quantityChange", "quantityAfter", reason, "performedById", "dateCreated") VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [inv.id, "SALE", -qty, Math.max(0, inv.quantity - qty), `فروش سفارش ${tracking}`, user.id, date]
        );
      }
    }
    orderCount++;
  }
  console.log(`  ${orderCount} orders`);

  // ---- initial restock movements ----
  for (const inv of stockInventories) {
    await client.query(
      'INSERT INTO stock_movement ("inventoryId", type, "quantityChange", "quantityAfter", reason, "performedById", "dateCreated") VALUES ($1,$2,$3,$4,$5,$6,$7)',
      [inv.id, "RESTOCK", inv.quantity, inv.quantity, "موجودی اولیه", users[0].id, daysAgo(rnd(30, 90))]
    );
  }
  console.log(`  ${stockInventories.length} restock movements`);

  // ---- analytics events ----
  for (let i = 0; i < 220; i++) {
    const eventType = pickAnalyticsType();
    const date = daysAgo(rnd(0, 30));
    const user = chance(0.6) ? pick(users) : null;
    if (eventType === "SEARCH") {
      await client.query(
        'INSERT INTO analytics_event ("eventType", "sessionId", "searchQuery", "userId", "dateCreated") VALUES ($1,$2,$3,$4,$5)',
        [eventType, sessionId(), pick(SEARCH_QUERIES), user?.id ?? null, date]
      );
    } else if (eventType === "CATEGORY_VIEW") {
      await client.query(
        'INSERT INTO analytics_event ("eventType", "sessionId", "categoryId", "userId", "dateCreated") VALUES ($1,$2,$3,$4,$5)',
        [eventType, sessionId(), pick(Object.values(categories)), user?.id ?? null, date]
      );
    } else {
      await client.query(
        'INSERT INTO analytics_event ("eventType", "sessionId", "productId", "userId", "metadata", "dateCreated") VALUES ($1,$2,$3,$4,$5,$6)',
        [eventType, sessionId(), pick(allProducts).id, user?.id ?? null, JSON.stringify({ source: "seed" }), date]
      );
    }
  }
  console.log("  220 analytics events");

  // ---- cart items ----
  if (stockInventories.length) {
    for (let i = 0; i < 2; i++) {
      const inv = pick(stockInventories);
      await client.query(
        'INSERT INTO shopping_cart_item ("userId", "inventoryId", count, "itemType") VALUES ($1,$2,$3,$4)',
        [users[users.length - 1].id, inv.id, rnd(1, 2), "SIMPLE"]
      );
    }
    if (setProducts.length) {
      const set = setProducts[0];
      await client.query(
        'INSERT INTO shopping_cart_item ("userId", "productSetId", "colorId", count, "itemType") VALUES ($1,$2,$3,1,$4)',
        [users[users.length - 1].id, set.id, set.colorIds[0] ?? null, "SET"]
      );
    }
    console.log("  cart items added");
  }

  const counts = await client.query(
    `SELECT (SELECT COUNT(*) FROM product) product, (SELECT COUNT(*) FROM category) category,
            (SELECT COUNT(*) FROM inventory) inventory, (SELECT COUNT(*) FROM image) image,
            (SELECT COUNT(*) FROM comment) comment, (SELECT COUNT(*) FROM "order") "order",
            (SELECT COUNT(*) FROM mold) mold, (SELECT COUNT(*) FROM pattern) pattern`
  );
  console.log("done:", counts.rows[0]);
  await client.end();
}

main().catch(async (e) => {
  console.error("seed failed:", e);
  try { await client.end(); } catch {}
  process.exit(1);
});
