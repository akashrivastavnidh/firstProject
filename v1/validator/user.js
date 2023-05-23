const joi = require("joi");

module.exports.singUp = joi.object({
    email:joi.string().email().optional().lowercase(),
    phone:joi.number().optional(),
    dailCode:joi.string().optional(),
    password:joi.string().required(),
    confirmPassword:joi.ref("password")
}).xor("email","phone")
module.exports.forgotPassword = joi.object({
    email:joi.string().email().optional().lowercase(),
})
module.exports.verifyOtp = joi.object({
    email:joi.string().email().optional().lowercase(),
    otp:joi.string().required()
})
module.exports.profileSetUp = joi.object({
    fristName:joi.string().required(),
    lastName:joi.string().required(),
    email:joi.string().email().optional().lowercase(),
    phone:joi.number().required(),
    intrests:joi.string().optional(),
    image:joi.string().optional(),
    userName:joi.string().required(),
    isProfileComplited:joi.boolean().required(),
    location:joi.string(),
    role:joi.string(),
    address:joi.object({
        country:joi.string().required(),
        state:joi.string().required(),
        city:joi.string().required()
    })
})
module.exports.login =joi.object({
    email:joi.string().email().required().lowercase(),
    password:joi.string().required(),
})
module.exports.resetPassword = joi.object({
    newPassword:joi.string().required(),
    confrimNewPassword:joi.ref("newPassword")
})
module.exports.chnagePassword = joi.object({
    password:joi.string(),
    newPassword:joi.string(),
    confirmPassword:joi.ref("newPassword")
})

module.exports.resendOtp = joi.object({
   email:joi.string().required().email().lowercase(),
})
module.exports.post=joi.object({
    id:joi.string().required(),

})