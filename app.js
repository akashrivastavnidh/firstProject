"use strict";
require("dotenv").config();
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const bodyParser = require("body-parser");
const morgan = require("morgan");
const connection = require("./common/connection");
const Router = require("./v1/routes")
const Responses = require("./common/responses")
app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(morgan("dev"));
app.use(Responses())

app.use("/",Router);

app.use((error, req, res, next) => {
    console.error(error);
    return res.status(400).send({message:error.message || error});
});

//server listin

server.listen(process.env.PORT,async()=>{
    console.log(`server connected on ${process.env.PORT}`)
    connection.mongodbConnection()

})