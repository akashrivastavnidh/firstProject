"use strict"
const Model = require("../../models");
const constants = require("../../common/constants");
const Auth = require("../../common/authentication")
const validation = require("../validator");
const Function = require("../../common/function");
const services = require("../services");
const { default: mongoose, model } = require("mongoose");
const { hash } = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;

//ADMIN ON BORDING
module.exports.signUp = async(req,res,next)=>{
    try {
        await validation.Admin.signUp.validateAsync(req.body);
        let check = null;
        if(req.body.email){
            check = await Model.Admin.findOne({email:(req.body.email).toLowerCase(),isDeleted:false,});
            if(check) throw new Error (constants.MESSAGE.EMAIL_ALREADY_IN_USE);
        }
        if(req.body.phoneNo){
            check = await Model.Admin.findOne({phoneNo:req.body.phoneNo,dailCode:req.body.dailCode,isDeleted:false});
            if(check) throw new Error(constants.MESSAGE.PHONE_NO_ALREADY_REGISTER);
        }
        else if(!req.body.phone && !req.body.email){
            return res.error(constants.MESSAGE.PLEASE_ENTER_THE_DATA)
        }
        let  user = await Model.Admin.create(req.body)
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_CREATED);
        await user.setPassword(req.body.password)
        await user.save()
        return res.success(constants.MESSAGE.ADMIN_CREATED,user)
    } catch (error) {
        next(error);
    }
}
module.exports.forgotPassword = async(req,res,next)=>{
    try {
        await validation.Admin.forgotPassword.validateAsync(req.body);
        let otp = Function.generateRandomStringAndNumbers(4);
    let user = await Model.Admin.findOne({email:(req.body.email).toLowerCase(),isDeleted:false});
        if(!user) throw new Error (constants.MESSAGE.USER_NOT_FOUND);
        let email = req.body.email
        await services.EmailServeice.sendEmail(email,otp);

        user = await Model.Admin.findOneAndUpdate({email:email,isDeleted:false},{$set:{otp:otp}},{new:true})
        return res.success(constants.MESSAGE.OTP_SEND_ON_EMAIL_ADDRESS,user);
    } catch (error) {
        next (error);
    }
}
module.exports.verifyOtp= async(req,res,next)=>{
    try {
    await validation.User.verifyOtp.validateAsync(req.body);
    let user = await Model.Admin.findOne({email:req.body.email,isDeleted:false});
    if(!user) new Error (constants.MESSAGE.USER_NOT_FOUND);
    if(user.otp != req.body.otp){
        throw new Error(constants.MESSAGE.OTP_NOT_MATCH)
    }
    user = await Model.Admin.findOneAndUpdate({email:req.body.email},{$set:{isEmailVerify:true}},{new:true})
    return res.success(constants.MESSAGE.OTP_VERIFY,user)
    } catch (error) {
        next(error);
    }
}
module.exports.profileSetup = async (req,res,next)=>{
    try {
        validation.User.profileSetUp.validateAsync(req.body);

        req.body.isProfileComplited = true
        let user = await Model.Admin.findOneAndUpdate({email:req.body.email},{$set:req.body},{new:true}).select("-password,otp");
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        return res.success(constants.MESSAGE.PROFILE_SET,user)
    } catch (error) {
        next(error);
    }
}
module.exports.login = async (req,res,next )=>{
    try {
        await validation.User.login.validateAsync(req.body);
        let user= await Model.Admin.findOne({email:(req.body.email).toLowerCase(),isDeleted:false,isEmailVerify:true});
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",user)
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        await user.authenticate(req.body.password)
        let jti = "";
        let assecctoken="";
        user.jti = Function.generateRandomStringAndNumbers(20);
        await user.save()
        user = JSON.parse(JSON.stringify(user));
        user.assecctoken = await Auth.getToken({
            jti :user.jti,
            _id:user._id
        })
        return res.success(constants.MESSAGE.SUCCESS,user.assecctoken)
    } catch (error) {
        next(error);
    }
}
module.exports.ResetPassword = async(req,res,next)=>{
    try {
        await validation.User.resetPassword.validateAsync(req.body);
        console.log(req.body)
        console.log(">>>>>>", req.admin._id, ">>>>>>")
        let user = await Model.Admin.findOne({ _id: ObjectId(req.admin._id)});
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        await user.setPassword(req.body.newPassword);
        await user.save();
        if(!user) throw new Error(constants.MESSAGE.PASSWORD_NOT_UPDATED);
        return res.success(constants.MESSAGE.PASSWORD_RESET,user)
    } catch (error) {
        next(error);
    }
}
module.exports.changePassword = async(req,res,next)=>{
    try {
        await validation.User.chnagePassword.validateAsync(req.body);
        let user = await Model.Admin.findOne({_id:ObjectId(req.admin._id),isDeleted:false})
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",user)
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        user.authenticate(req.body.password);
        await user.setPassword(req.body.newPassword);
        await user.save();
        if(!user) throw new Error(constants.MESSAGE.PASSWORD_NOT_UPDATED);
        return res.success(constants.MESSAGE.PASSWORD_RESET,user)
    } catch (error) {
        next(next);
    }
}
module.exports.resendOtp = async(req,res,next)=>{
    try {
        await validation.User.forgotPassword.validateAsync(req.body);
        let otp = Function.generateRandomStringAndNumbers(4);
        let user = await Model.Admin.findOne({email:(req.body.email).toLowerCase(),isEmailVerify:true,isDeleted:false});
        if(!user) throw new Error (constants.MESSAGE.USER_NOT_FOUND);
        let email = req.body.email
        await services.EmailServeice.sendEmail(email,otp);
        user = await Model.Admin.findOneAndUpdate({email:email,isDeleted:false},{$set:{otp:otp}})
        return res.success(constants.MESSAGE.OTP_SEND_ON_EMAIL_ADDRESS,user);
    } catch (error) {
        next (error);
    }

}
module.exports.getProfile = async(req,res,next)=>{
    try {
        const user = await Model.Admin.findOne({_id:ObjectId(req.admin._id),isDeleted:false}).lean();
        if(!user)throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        return res.success(constants.MESSAGE.FETCH_DATA,user)
    } catch (error) {
        next(error)
    }
}
module.exports.logout = async(req,res,next)=>{
    try {
        await Model.Admin.findOne({_id:ObjectId(req.admin._id)});
        let newJti = Function.generateRandomStringAndNumbers(20);
        let user = await Model.Admin.findByIdAndUpdate({_id:ObjectId(req.admin._id)},{$set:{jti:newJti}},{new:true})
        if(!user)throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        return res.success(constants.MESSAGE.SUCCESS,user)
    } catch (error) {
        next(error);
    }
}
module.exports.deleteUser = async(req,res,next)=>{
    try {
        const user = await Model.Admin.findOneAndUpdate({_id:ObjectId(req.admin._id)},{$set:{isDeleted:true}},{new:true});
        if(!user) throw new Error (constants.MESSAGE.USER_NOT_FOUND)
        return res.success(constants.MESSAGE.DELETED_SUCCESSFULLY,user)
    } catch (error) {
        next(error);
    }
}
module.exports.uploadFile = async (req, res, next) => {
    try {
        if (!req.file) throw new Error(constants.MESSAGE.FILE_NOT_UPLOADED);
        console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.file)
        console.log("idiwadi")
        const filePath = req.file;
        const image = filePath.location;
        await Model.Admin.findOneAndUpdate({_id:ObjectId(req.admin._id)},{$set:{image:image}})
        return res.success(constants.MESSAGE.IMAGE_UPLOADED,image);
    } catch (error) {
        next(error);
    }
}




//******ADD CATEGORY */

module.exports.Add_Category = async(req,res,next)=>{
try {
    await validation.Admin.AddCategory.validateAsync(req.body);
    let category = await Model.Cagetory.findOne({name:req.body.name});
    if(category) throw new Error(constants.MESSAGE.CATEGORY_ALREADY_EXIST);
    category = await Model.Cagetory.create(req.body);
    if(!category)throw new Error(constants.MESSAGE.CATEGORY_NOT_ADD);
    return res.success(constants.MESSAGE.CATEGORY_ADD_SUCCESSFULL,category);
} catch (error) {
    next(error);
}

//subCategory******************//////
}
module.exports.UpdateCategory= async(req,res,next)=>{
    try {
        await validation.Admin.updateCategory.validateAsync(req.body);
        let category = await Model.Cagetory.findOne({_id:ObjectId(req.body.id),isDeleted:false});
        if(!category)throw new Error(constants.MESSAGE.CATEGORY_NOT_FOUND);
        category = await Model.Cagetory.findOneAndUpdate({_id:ObjectId(req.body.id)},{$set:req.body},{new:true});
        if(!category) throw new Error (constants.MESSAGE.CATEGORY_NOT_ADD);
        return res.success(constants.MESSAGE.CATEGORY_UPDATED_SUCCESSFULL,category);
    } catch (error) {
        next(error);
    }
}
module.exports.deleteCategory = async(req,res,next)=>{
    try {
        await validation.Admin.deleteCategory.validateAsync(req.body);
        if(req.body.id){
            let del = await Model.Cagetory.findOneAndUpdate({_id:ObjectId(req.body.id)},{$set:{isDeleted:true}},{new:true});
            if(!del)throw new Error(constants.MESSAGE.CATEGORY_NOT_DELETED);
        }
        if(req.body.name){
            let del = await Model.Cagetory.findOneAndUpdate({name:req.body.name},{$set:{isDeleted:true}},{new:true});
            if(!del)throw new Error(constants.MESSAGE.CATEGORY_NOT_DELETED);
        }
        else if(!req.body.id && req.body.name){
            return res.error(constants.MESSAGE.PLEASE_ENTER_THE_DATA)
        }

        return res.success(constants.MESSAGE.CATEGORY_DELETED)
    } catch (error) {
        next(error);
    }
}
module.exports.get_All_Category = async(req,res,next)=>{
    try {
        let category = await Model.Cagetory.find();
        if(!category)throw new Error(constants.MESSAGE.CATEGORY_NOT_FOUND);
        return res.success(constants.MESSAGE.SUCCESS,category);
    } catch (error) {
        next(error)
    }
}
//subcategory
module.exports.Add_SubCategory = async(req, res, next)=>{
    try {
        await validation.Admin.AddSubCategory.validateAsync(req.body);
        let category = await Model.SubCategory.create(req.body);
        if(!category) throw new Error(constants.MESSAGE.CATEGORY_NOT_ADD);
        return res.success(constants.MESSAGE.CATEGORY_ADD_SUCCESSFULL,category);
    } catch (error) {
        next(error);
    }
}
module.exports.UpdateSubCategory = async(req,res,next)=>{
    try {
        await validation.Admin.UpdateSubCategory.validateAsync(req.body);
        let update_sub = await Model.SubCategory.findOneAndUpdate({_id:ObjectId(req.body.id)},{$set:req.body},{new:true})
        if(!update_sub) throw new Error(constants.MESSAGE.SUBCATEGORY_NOT_UPDATED);
        return res.success(constants.MESSAGE.SUBCATEGORY_UPDATED,update_sub);
    } catch (error) {
        next(error);
    }
}
module.exports.deleteSubCategory = async(req,res,next)=>{
    try {
        await validation.Admin.deleteSubCategory.validateAsync(req.body);
        let del = await Model.SubCategory.findOneAndUpdate({_id:ObjectId(req.body.id)},{$set:{isDeleted:true}},{new:true});
        if(!del) throw new Error (constants.MESSAGE.SUBCATEGORY_NOT_FOUND);
        return res.success(constants.MESSAGE.SUBCATEGORY_UPDATED);
    } catch (error) {
        next(error)
    }
}
module.exports.get_All_SubCategory = async(req,res,next)=>{
    try {
        let category = await Model.SubCategory.find();
        if(!category)throw new Error(constants.MESSAGE.CATEGORY_NOT_FOUND);
        return res.success(constants.MESSAGE.SUCCESS,category);
    } catch (error) {
        next(error)
    }
}