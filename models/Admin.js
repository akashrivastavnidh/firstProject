const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const constants = require('../common/constants')
const ObjectId = mongoose.Schema.Types.ObjectId;

const AdminSchema= new mongoose.Schema({
    email: {type: String,default: "",lowercase: true},
    phoneNo: {type: String,default: ""},
    dialCode: {type: String,default: ""},
    role: {type: String,enum: ["ADMIN","SUBADMIN",],default:"USER"},
    accessRole: {type: ObjectId, ref: "AccessRole", default: null},
    password: {type: String,default: ""},
    name: {type: String,default: ""},
    otp:{type:String,default:""},
    image: {type: String,default: "" },
    isBlocked: {type: Boolean,default: false},
    isDeleted: {type: Boolean,default: false},
    isEmailVerify: {type: Boolean,default: false},
    isPhoneVerify: {type: Boolean,default: false},
    isProfileComplited:{type:Boolean,default:false},
    jti: {type: String},
    permission: [{
        label: {type: String, default: null},
        isView: {type: Boolean,default: false},
        isAdd: {type: Boolean,default: false}
    }]
}, {
    timestamps: true
});


AdminSchema.set("toJSON", {
    getters: true,
    virtuals: true
});

AdminSchema.methods.authenticate = function (password, callback) {
    const promise = new Promise((resolve, reject) => {
        if (!password) {
            reject(new Error("MISSING_PASSWORD"));
        }
        bcrypt.compare(password, this.password, (error, result) => {
            if (!result) reject(new Error("INVALID PASSWORD"));
            resolve(this);
        });
    });

    if (typeof callback !== "function") return promise;
    promise.then((result) => callback(null, result)).catch((err) => callback(err));
};

AdminSchema.methods.setPassword = function (password, callback) {
    const promise = new Promise((resolve, reject) => {
        if (!password) reject(new Error("Missing Password"));

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) reject(err);
            this.password = hash;
            resolve(this);
        });
    });

    if (typeof callback !== "function") return promise;
    promise.then((result) => callback(null, result)).catch((err) => callback(err));
};

const admin= mongoose.model("Admins", AdminSchema);
module.exports= admin