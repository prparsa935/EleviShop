import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config();
const dataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [
    process.env.NODE_ENV === "production" ? "dimodels/*.js" : "models/*.ts",
  ],
  migrations: ["migrations/*.ts"],

  synchronize: true,
});

export default dataSource;
