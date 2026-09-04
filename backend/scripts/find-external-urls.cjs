// جستجوی تمام ستون‌های متنی دیتابیس برای پیدا کردن آدرس‌های خارجی (http)
const fs = require('fs');
const { Client } = require('pg');

const env = {};
for (const line of fs.readFileSync(require('path').join(__dirname, '..', '.env'), 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z_]+)\s*=\s*"?([^"]*)"?/);
  if (m) env[m[1]] = m[2];
}
const c = new Client({
  host: env.DB_HOST || 'localhost', port: Number(env.DB_PORT || 5432),
  database: env.DB_NAME || 'elevi', user: env.DB_USERNAME || 'postgres', password: env.DB_PASSWORD,
});

(async () => {
  await c.connect();
  const cols = await c.query(
    `SELECT table_name, column_name FROM information_schema.columns
     WHERE table_schema='public' AND data_type IN ('text','character varying','json','jsonb')`
  );
  for (const col of cols.rows) {
    try {
      const q = `SELECT COUNT(*) n FROM "${col.table_name}" WHERE "${col.column_name}"::text LIKE '%http%'`;
      const r = await c.query(q);
      if (Number(r.rows[0].n) > 0) {
        console.log(`${col.table_name}.${col.column_name} -> ${r.rows[0].n} rows`);
        const sample = await c.query(
          `SELECT "${col.column_name}" v FROM "${col.table_name}" WHERE "${col.column_name}"::text LIKE '%http%' LIMIT 3`
        );
        sample.rows.forEach(s => console.log('   ', String(s.v).slice(0, 140)));
      }
    } catch (e) { /* skip */ }
  }
  await c.end();
})().catch(e => { console.error('ERR:', e.message); process.exit(1); });
