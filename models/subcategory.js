const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const subcategory = new mongoose.Schema({
    name:{type:String},
    image:{type:String,default:""},
    isDeleted:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false},
    categoryId:{
        type:ObjectId,
        ref:"Category"
    }
})

const SubCategory = mongoose.model("SubCategory",subcategory);
module.exports = SubCategory;