import express from "express";
import cors from "cors";
const app = express();
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dataSource from "./utils/dbConfiguration.js";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: __dirname + "/.env" });
import apiRouter from "./routes/api.js";
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("build"));
app.use(express.static("adminpanelbuild"));
dataSource
    .initialize()
    .then(async () => {
    await dataSource.synchronize();
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
app.use(cors());
// white list pages
app.use((req, res, next) => {
    if (!req.path.startsWith("/admin") &&
        !req.path.startsWith("/api") &&
        !req.path.startsWith("/profile")) {
        return res.sendFile(__dirname + "/build/index.html");
    }
    else {
        next(); // Pass control to the next middleware or route handler
    }
});
app.use("/api", apiRouter);
// app.get('/admin',(req,res)=>{
//     // res.json({dadassd:"dadadas"})
//     res.sendFile(__dirname+'/build/index.html')
// })
const mainDir = __dirname;
export { mainDir };
app.listen(process.env.PORT || 8000, () => {
    console.log(`TypeScript with Express
    http://localhost:8000/`);
});
// app.listen(8000,'192.168.1.102')
