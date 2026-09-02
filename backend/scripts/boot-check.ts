import "reflect-metadata";
import "dotenv/config";
import dataSource from "../utils/dbConfiguration.js";

const main = async () => {
  await dataSource.initialize();
  await dataSource.synchronize();
  console.log("boot-check OK: entities loaded, schema synchronized");
  await dataSource.destroy();
};

main().catch(async (error) => {
  console.error("boot-check failed:", error);
  try {
    await dataSource.destroy();
  } catch {}
  process.exit(1);
});
