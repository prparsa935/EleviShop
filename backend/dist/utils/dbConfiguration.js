import { DataSource } from "typeorm";
const dataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "Yecg@@48255",
    database: "elevi",
    entities: ["dist/models/*.js"],
    migrations: ["migrations/*.ts"],
    synchronize: true,
});
export default dataSource;
