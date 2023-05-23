const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const category = new mongoose.Schema({
    name:{type:String},
    icon:{type:String},
    colour:{type:String},
    isDeleted:{type:Boolean,default:false},
    userID:{
        type:ObjectId,
        ref:"SubCategory"

    }
})

const CategoryModel = mongoose.model("Category",category);
module.exports = CategoryModel;