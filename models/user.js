"use strict"
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    fristName:{type:String,default:""},
    lastName:{type:String,default:""},
    gender:{type:String,enm:["MALE","FEMALE","OTHER"]},
    email:{type:String},
    password:{type:String},
    dailCode:{type:String,default:""},
    phone:{type:Number},
    intrest:{type:String,},
    userName:{type:String,default:""},
    isEmailverify:{type:Boolean,default:false},
    isProfileComplited:{type:Boolean,default:false},
    isDeleted:{type:Boolean, default:false},
    jti:{type:String,default:""},
    assecctoken:{type:String,default:"",index:true},
    socailLogin:{type:String,enm:["facebook","google","apple"]},
    accessToken:{type:String},
    tokenExprire:{type:String},
    coordinates:{type:[Number], default:[0,0]},
    isAllow:{type:Boolean,default:true},
    otp:{type:String,default:""},
    otpExprire:{type:String,default:""},
    image:{type:String,default:""},
    role:{type:String,enu:["user"],default:"guest"},
    address:{
        country:{type:String},
        state:{type:String},
        city:{type:String}
    },

},
{
    timestamps:true
});
userSchema.index({
    location:"2dsphere"
})

userSchema.methods.setPassword = function (password, callback) {
    console.log(password);
    const promise = new Promise((resolve, reject) => {
    if (!password) reject(new Error("Missing Password"));
  
    bcrypt.hash(password, 10, (err, hash) => {
        if (err) reject(err);
        this.password = hash;
        resolve(this);
    });
    });
  
    if (typeof callback !== "function") return promise;
    promise
        .then((result) => callback(null, result))
        .catch((err) => callback(err));
  };

userSchema.methods.isValidPassword = function (password, callback) {
    const promise = new Promise((resolve, reject) => {
        if (!password) reject(new Error("MISSING_PASSWORD"));
  
        bcrypt.compare(password, this.password, (error, result) => {
        if (!result) {
            reject(new Error("Invalid Password"));
        }
        resolve(this);
        });
    });
  
    if (typeof callback !== "function") return promise;
    promise
      .then((result) => callback(null, result))
      .catch((err) => callback(err));
  };

const userModel = new mongoose.model("User",userSchema);
module.exports = userModel;