// بررسی صحت اسکن: لیست جدول‌ها + نمونه‌ی مسیر عکس‌ها + بزرگ‌ترین فایل‌ها
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const env = {};
for (const line of fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?/);
  if (m) env[m[1]] = m[2];
}
const c = new Client({
  host: env.DB_HOST || 'localhost', port: Number(env.DB_PORT || 5432),
  database: env.DB_NAME || 'elevi', user: env.DB_USERNAME || 'postgres', password: env.DB_PASSWORD,
});

(async () => {
  await c.connect();
  const tables = await c.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public'`);
  console.log('tables:', tables.rows.map(t => t.table_name).join(', '));

  const imgs = await c.query(`SELECT "filePath" FROM image LIMIT 8`);
  console.log('\nsample filePaths:');
  imgs.rows.forEach(r => console.log('  ', r.filePath));

  const lens = await c.query(`SELECT MAX(LENGTH("filePath")) maxLen, COUNT(*) FILTER (WHERE "filePath" LIKE '%/%') withSlash FROM image`);
  console.log('\nmax filePath length:', lens.rows[0].maxlen, '| filePaths containing slash:', lens.rows[0].withslash);
  await c.end();
})().catch(e => { console.error('ERR:', e.message); process.exit(1); });
