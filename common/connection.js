"use strict";
const mongoose = require("mongoose");
const url = process.env.DB_URL;
const dataBase = process.env.DB_NAME
module.exports.mongodbConnection = async()=>{
    mongoose.set('strictQuery',false)
    await mongoose.connect(url,{
        dbName : dataBase,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    },
    (error, result) => {
        error ? console.error("Mongo", error) : console.log("Mongo Connected");
    })
}