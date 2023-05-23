 const Model = require("../../models");
const constants = require("../../common/constants");
const Auth = require("../../common/authentication")
const validation = require("../validator");
const { password } = require("../../models/user");
const Function = require("../../common/function");
const services = require("../services");
const { default: mongoose, model } = require("mongoose");
const { hash } = require("bcryptjs");
const ObjectId = mongoose.Types.ObjectId;

//on bording
module.exports.singup = async(req,res,next)=>{
    try {
        await validation.User.singUp.validateAsync(req.body);
        let check = null;
        if(req.body.email){
            console.log(">>>>>>>>>>>>>>",req.body.email);
            check = await Model.User.findOne({email:req.body.email,isDeleted:false,isEmailverify:true,});
            if(check) throw new Error (constants.MESSAGE.EMAIL_ALREADY_IN_USE);
        }
        if(req.body.phone){
            check = await Model.User.findOne({phone:req.body.phone,dailCode:req.body.dailCode,isDeleted:false});
            if(check) throw new Error(constants.MESSAGE.PHONE_NO_ALREADY_REGISTER);
        }
        else if(!req.body.phone && !req.body.email){
            return res.error(constants.MESSAGE.PLEASE_ENTER_THE_DATA)
        }
        let  user = await Model.User.create(req.body)
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_CREATED);
        await user.setPassword(req.body.password)
        await user.save()
        return res.success(constants.MESSAGE.USER_CREATRD,user)
    } catch (error) {
        next(error);
    }
}
module.exports.socailLogin = async(req,res,next)=>{


}
module.exports.forgotPassword = async(req,res,next)=>{
    try {
        await validation.User.forgotPassword.validateAsync(req.body);
        let otp = Function.generateRandomStringAndNumbers(4);
        let user = await Model.User.findOne({email:(req.body.email).toLowerCase(),isDeleted:false,});
        if(!user) throw new Error (constants.MESSAGE.USER_NOT_FOUND);
        let email = req.body.email
        await services.EmailServeice.sendEmail(email,otp);
        user = await Model.User.findOneAndUpdate({email:email,isDeleted:false},{$set:{otp:otp}})
        return res.success(constants.MESSAGE.OTP_SEND_ON_EMAIL_ADDRESS,user);
    } catch (error) {
        next (error);
    }
}
module.exports.verifyOtp= async(req,res,next)=>{
    try {
    await validation.User.verifyOtp.validateAsync(req.body);
    user = await Model.User.findOne({email:req.body.email,isDeleted:false});
    if(!user) new Error (constants.MESSAGE.USER_NOT_FOUND);
    if(user.otp != req.body.otp){
        throw new Error(constants.MESSAGE.OTP_NOT_MATCH)
    }
    user = await Model.User.findOneAndUpdate({email:req.body.email},{$set:{isEmailverify:true}},{new:true})
    return res.success(constants.MESSAGE.OTP_VERIFY,user)
    } catch (error) {
        next(error);
    }
}
module.exports.profileSetup = async (req,res,next)=>{
    try {
        validation.User.profileSetUp.validateAsync(req.body);

        req.body.isProfileComplited = true
        user = await Model.User.findOneAndUpdate({email:req.body.email},{$set:req.body},{new:true}).select("-password,otp");
        if(!user) throw new Error(constants.MESSAGE.user_NOT_FOUND);
        return res.success(constants.MESSAGE.PROFILE_SET,user)
    } catch (error) {
        next(error);
    }
}
module.exports.login = async (req,res,next )=>{
    try {
        await validation.User.login.validateAsync(req.body);
        let user= await Model.User.findOne({email:req.body.email,isDeleted:false,isEmailverify:true});
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        await user.isValidPassword(req.body.password)
        let jti = "";
        let assecctoken="";
        user = await Model.User.findOne({email:req.body.email,isEmailverify:true});
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
        let user = await Model.User.findOne({_id:ObjectId(req.user._id),isDeleted:false,isProfileComplited:true});
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
        let user = await Model.User.findOne({_id:ObjectId(req.user._id),isDeleted:false})
        if(!user) throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        user.isValidPassword(req.body.password);
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
        let user = await Model.User.findOne({email:(req.body.email).toLowerCase(),isEmailverify:true,isDeleted:false});
        if(!user) throw new Error (constants.MESSAGE.USER_NOT_FOUND);
        let email = req.body.email
        await services.EmailServeice.sendEmail(email,otp);
        user = await Model.User.findOneAndUpdate({email:email,isDeleted:false},{$set:{otp:otp}})
        return res.success(constants.MESSAGE.OTP_SEND_ON_EMAIL_ADDRESS,user);
    } catch (error) {
        next (error);
    }

}
module.exports.getProfile = async(req,res,next)=>{
    try {
        const user = await Model.User.findOne({_id:ObjectId(req.user._id),isDeleted:false}).lean();
        if(!user)throw new Error(constants.MESSAGE.USER_NOT_FOUND);
        return res.success(constants.MESSAGE.FETCH_DATA,user)
    } catch (error) {
        next(error)
    }
}
module.exports.logout = async(req,res,next)=>{
    try {
       await Model.User.findOne({_id:ObjectId(req.user._id)});
       newJti = Function.generateRandomStringAndNumbers(20);
       user = await Model.User.findByIdAndUpdate({_id:ObjectId(req.user._id)},{$set:{jti:newJti}},{new:true}) 
       if(!user)throw new Error(constants.MESSAGE.USER_NOT_FOUND);
       return res.success(constants.MESSAGE.SUCCESS,user)
    } catch (error) {
        next(error);
    }
}
module.exports.deleteUser = async(req,res,next)=>{
    try {
        const user = await Model.User.findOneAndUpdate({_id:ObjectId(req.user._id)},{$set:{isDeleted:true}},{new:true});
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
        await Model.User.findByIdAndUpdate({_id:req.user._id},{$set:{image:image}})
        return res.success(constants.MESSAGE.IMAGE_UPLOADED,image);
    } catch (error) {
        next(error);
    }
}
///post the ting



module.exports.post_Detail= async(req,res,next)=>{
    try {
        let post = await Model.User.findOne({_id:ObjectId(req.user._id),isDeleted:false,isEmailverify:true});
        if(!post)throw new Error (constants.MESSAGE.USER_NOT_FOUND);
        let currentLocation= post.address;
        if (!req.file) throw new Error(constants.MESSAGE.FILE_NOT_UPLOADED);
        const filePath = req.file;
        const image = filePath.location;
        await Model.SubCategory.findByIdAndUpdate({_id:req.user._id},{$set:{image:image}})
        let Qucick_Adds = await Model.Cagetory.aggregate([
            {
                $lookup:
                    {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "CategoryID",
                    as: "subcategories"
                    },
            },
        ])
        if(!Qucick_Adds)throw new Error(constants.MESSAGE.SUBCATEGORY_NOT_FOUND);
        let data ={
            currentLocation,
            Qucick_Adds,
            image
        }
        return res.success(constants.MESSAGE.SUCCESS,data);
    } catch (error) {
        next(error);
    }

}