import "reflect-metadata";
import "dotenv/config";
import { DataSource } from "typeorm";
const ds = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
const main = async () => {
    await ds.initialize();
    const current = await ds.query(`SELECT current_database() AS db, current_user AS usr`);
    const tables = await ds.query(`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`);
    console.log(JSON.stringify({
        env: {
            DB_HOST: process.env.DB_HOST,
            DB_PORT: process.env.DB_PORT,
            DB_NAME: process.env.DB_NAME,
            DB_USERNAME: process.env.DB_USERNAME,
        },
        current: current[0],
        tables: tables.map((t) => t.table_name),
    }, null, 2));
    await ds.destroy();
};
main().catch(async (e) => {
    console.error("check-db failed:", e.message);
    try {
        await ds.destroy();
    }
    catch { }
    process.exit(1);
});
