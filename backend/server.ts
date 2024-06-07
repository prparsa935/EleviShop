import express=require("express") 

import cors = require("cors");


const app=express()
import bodyParser = require('body-parser');
import cookieParser = require("cookie-parser");
import { createConnection } from 'typeorm'
// import userApi from './routers/userApi'
// import authorization from "./utils/authorization"
import dotenv= require("dotenv")
import transactionApi from './routers/transaction'
import dataSource from "./utils/dbConfiguration";
import userApi from "./routers/userApi";
import { User } from "./models/user";
import { Socket } from "net";
dotenv.config({ path: __dirname+'/.env' });
import { join } from "path";
import util =require('node:util') 
import orderRouter from "./routers/order";
import fs=require('fs')

// const reply = "";
// var Client = new WebSocket('ws://192.168.1.2:25565');
// Client.onopen = function () {
//     console.log('Connected!');
//     Client.send('Ping'); // Send the message 'Ping' to the server
//     };


// console.log() 
app.use(cookieParser())

app.set('views','views/')
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }))

app.use(express.json())

app.use(express.static('public'))
app.use(express.static('build'))
app.use(express.static('adminpanelbuild'))


dataSource
.initialize()
.then(async() => {
    await dataSource.synchronize();
    console.log("Data Source has been initialized!")
})
.catch((err) => {
    console.error("Error during Data Source initialization:", err)
})
app.use(cors())

app.use('/transactionprocess',transactionApi)


app.use('/userapi',userApi)
app.use('/orderapi',orderRouter)
// get post put delete
app.get('/',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})
// app.get('/admin',(req,res)=>{
    
//     // res.json({dadassd:"dadadas"})
//     res.sendFile(__dirname+'/build/index.html')
    
// })


app.get('/product/:id',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})
app.get('/products',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})
app.get('/completeinformation',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})
app.get('/transaction',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})
app.get('/transaction/verifytransaction',(req,res)=>{
    
    // res.json({dadassd:"dadadas"})
    res.sendFile(__dirname+'/build/index.html')
    
})

import plateRouter from "./routers/plate";
app.use('/plateapi',plateRouter)


app.get("/login",(req,res)=>{

    
    res.sendFile(__dirname+'/build/index.html')
    
})
import adminRouter from "./routers/admin";
import path = require("path");
import { isNumberObject } from "util/types";
import { isNumber } from "util";


const mainDir=__dirname
export {mainDir}
app.use('/admin',adminRouter)



app.listen(process.env.PORT||8000,()=>{
    console.log(`TypeScript with Express
    http://localhost:8000/`);
})
// app.listen(8000,'192.168.1.102')


