import express = require("express");

import cors = require("cors");

const app = express();
import bodyParser = require("body-parser");
import cookieParser = require("cookie-parser");
import dotenv = require("dotenv");
import dataSource from "./utils/dbConfiguration";

dotenv.config({ path: __dirname + "/.env" });

import apiRouter from "./routes/api";

// console.log()
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
  if (
    !req.path.startsWith("/admin") &&
    !req.path.startsWith("/api") &&
    !req.path.startsWith("/profile")
  ) {
    return res.sendFile(__dirname + "/build/index.html");
  } else {
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
