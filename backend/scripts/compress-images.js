/**
 * فشرده‌سازی تمام عکس‌های سایت با حفظ نام فایل
 * - همه‌ی عکس‌های backend/public (شامل seed) را بازگشتی پیدا می‌کند
 * - JPEG/PNG/WebP/AVIF را با کیفیت مناسب دوباره انکود می‌کند
 * - عکس‌های خیلی بزرگ را تا عرض 1920px کوچک می‌کند
 * - اگر نسخه‌ی فشرده بزرگ‌تر یا مساوی اصل بود، فایل اصلی دست‌نخورده می‌ماند
 * - خروجی با همان نام و همان مسیر جایگزین می‌شود
 *
 * اجرا:  node scripts/compress-images.js
 * فقط گزارش بدون تغییر:  node scripts/compress-images.js --dry-run
 * پارامترها: --max-width 1400  --jpeg-quality 62  --png-quality 70  --webp-quality 60  --skip-under 20
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..', 'public');
const DRY_RUN = process.argv.includes('--dry-run');

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? Number(process.argv[i + 1]) : fallback;
}

const MAX_WIDTH = arg('max-width', 1920);        // حداکثر عرض
const JPEG_QUALITY = arg('jpeg-quality', 78);
const PNG_QUALITY = arg('png-quality', 80);
const WEBP_QUALITY = arg('webp-quality', 75);
const SKIP_UNDER_KB = arg('skip-under', 30);
const SKIP_UNDER_BYTES = SKIP_UNDER_KB * 1024;   // عکس‌های کوچک‌تر دست نمی‌خورند

const IMAGE_RE = /\.(jpe?g|png|webp|avif)$/i;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (IMAGE_RE.test(entry.name)) files.push(full);
  }
  return files;
}

// فرمت مقصد = فرمت فعلی، تا نام و پسوند فایل عوض نشود
function encoderFor(file) {
  const ext = path.extname(file).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg')
    return { type: 'jpeg', opts: { quality: JPEG_QUALITY, mozjpeg: true } };
  if (ext === '.png')
    return { type: 'png', opts: { quality: PNG_QUALITY, palette: true, effort: 4 } };
  if (ext === '.webp')
    return { type: 'webp', opts: { quality: WEBP_QUALITY, effort: 4 } };
  return { type: 'avif', opts: { quality: 60, effort: 4 } };
}

async function main() {
  if (!fs.existsSync(ROOT)) {
    console.error('پوشه پیدا نشد:', ROOT);
    process.exit(1);
  }
  const files = walk(ROOT);
  console.log(`تعداد عکس‌ها: ${files.length}${DRY_RUN ? ' (dry-run)' : ''}`);
  console.log(`تنظیمات: عرض حداکثر ${MAX_WIDTH}px | JPEG q${JPEG_QUALITY} | PNG q${PNG_QUALITY} | WebP q${WEBP_QUALITY}\n`);

  let beforeTotal = 0, afterTotal = 0, changed = 0, skipped = 0, failed = 0;

  for (const file of files) {
    const before = fs.statSync(file).size;
    beforeTotal += before;
    const rel = path.relative(ROOT, file);

    try {
      if (before <= SKIP_UNDER_BYTES) { skipped++; afterTotal += before; continue; }

      const image = sharp(file, { failOn: 'none' });
      const metadata = await image.metadata();
      let pipeline = image;

      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
      }

      const enc = encoderFor(file);
      const out = await pipeline[enc.type](enc.opts).toBuffer();

      if (out.length < before) {
        afterTotal += out.length;
        changed++;
        console.log(`✔ ${rel}: ${(before / 1024).toFixed(0)}KB → ${(out.length / 1024).toFixed(0)}KB`);
        if (!DRY_RUN) {
          const tmp = file + '.tmp';
          fs.writeFileSync(tmp, out);
          fs.renameSync(tmp, file);
        }
      } else {
        afterTotal += before;
        skipped++;
      }
    } catch (err) {
      failed++;
      afterTotal += before;
      console.error(`✖ ${rel}: ${err.message}`);
    }
  }

  const savedMB = ((beforeTotal - afterTotal) / 1024 / 1024).toFixed(2);
  const pct = beforeTotal ? ((1 - afterTotal / beforeTotal) * 100).toFixed(1) : 0;
  console.log('\n——— خلاصه ———');
  console.log(`فشرده‌شده: ${changed} | بدون تغییر: ${skipped} | خطا: ${failed}`);
  console.log(`حجم کل: ${(beforeTotal / 1024 / 1024).toFixed(2)}MB → ${(afterTotal / 1024 / 1024).toFixed(2)}MB (صرفه‌جویی ${savedMB}MB ≈ ${pct}%)`);
}

main();
