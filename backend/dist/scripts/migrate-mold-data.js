import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
const migrationDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
});
async function main() {
    await migrationDataSource.initialize();
    const q = (sql, params) => migrationDataSource.query(sql, params);
    // drop leftover empty PascalCase tables from the earlier buggy run
    await q(`DROP TABLE IF EXISTS "MoldPattern"`);
    await q(`DROP TABLE IF EXISTS "MoldSize"`);
    await q(`DROP TABLE IF EXISTS "Pattern"`);
    await q(`DROP TABLE IF EXISTS "Mold"`);
    // TypeORM default naming strategy: snake_case table names, quoted camelCase columns
    await q(`CREATE TABLE IF NOT EXISTS mold (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, shape VARCHAR(50) NULL)`);
    await q(`CREATE TABLE IF NOT EXISTS pattern (id SERIAL PRIMARY KEY, name VARCHAR(50) NOT NULL, "previewImageId" INT NULL)`);
    await q(`CREATE TABLE IF NOT EXISTS mold_size (id SERIAL PRIMARY KEY, "moldId" INT NOT NULL, "sizeLabel" VARCHAR(50) NOT NULL, height INT NULL, width INT NULL, weight INT NULL)`);
    await q(`CREATE TABLE IF NOT EXISTS mold_pattern (id SERIAL PRIMARY KEY, "moldId" INT NOT NULL, "patternId" INT NULL)`);
    await q(`ALTER TABLE product ADD COLUMN IF NOT EXISTS "moldSizeId" INT NULL`);
    await q(`ALTER TABLE product ADD COLUMN IF NOT EXISTS "moldPatternId" INT NULL`);
    await q(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS "colorId" INT NULL`);
    const migrated = await q(`SELECT COUNT(*)::int AS count FROM product WHERE "moldPatternId" IS NOT NULL`);
    if (migrated[0].count > 0) {
        console.log("Migration already applied, skipping data backfill");
        await migrationDataSource.destroy();
        return;
    }
    // move color from product.colorId down to inventory.colorId
    await q(`UPDATE inventory SET "colorId" = p."colorId" FROM product p WHERE inventory."productId" = p.id AND p."colorId" IS NOT NULL`);
    const plates = await q(`SELECT id, name, pattern, weight, height, width FROM product WHERE type = 'plate'`);
    for (const plate of plates) {
        const patternName = (plate.pattern || "").trim();
        let patternId = null;
        if (patternName) {
            const existing = await q(`SELECT id FROM pattern WHERE name = $1 LIMIT 1`, [patternName]);
            if (existing.length > 0) {
                patternId = existing[0].id;
            }
            else {
                patternId = (await q(`INSERT INTO pattern (name) VALUES ($1) RETURNING id`, [
                    patternName,
                ]))[0].id;
            }
        }
        const mold = (await q(`INSERT INTO mold (name) VALUES ($1) RETURNING id`, [plate.name]))[0];
        const moldSize = (await q(`INSERT INTO mold_size ("moldId", "sizeLabel", height, width, weight) VALUES ($1, $2, $3, $4, $5) RETURNING id`, [
            mold.id,
            "استاندارد",
            plate.height ?? null,
            plate.width ?? null,
            plate.weight ?? null,
        ]))[0];
        const moldPattern = (await q(`INSERT INTO mold_pattern ("moldId", "patternId") VALUES ($1, $2) RETURNING id`, [mold.id, patternId]))[0];
        await q(`UPDATE product SET "moldSizeId" = $1, "moldPatternId" = $2 WHERE id = $3`, [moldSize.id, moldPattern.id, plate.id]);
    }
    console.log(`Migration completed for ${plates.length} plate products`);
    await migrationDataSource.destroy();
}
main().catch(async (error) => {
    console.error("Migration failed:", error);
    try {
        await migrationDataSource.destroy();
    }
    catch { }
    process.exit(1);
});
