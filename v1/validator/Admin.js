const joi = require("joi");
module.exports.signUp = joi.object({
    phoneNo:joi.string().regex(/^[0-9]{5,}$/).optional(),
    dialCode:joi.string().regex(/^\+?[0-9]{1,}$/).optional(),
    email:joi.string().email().lowercase().optional(),
    password:joi.string().required(),
    confirmPassword: joi.ref("password"),
    role:joi.string()
}).with("dialCode","phoneNo").xor("phoneNo","email")
module.exports.forgotPassword = joi.object({
    email:joi.string().email().optional().lowercase(),
})
module.exports.AddCategory = joi.object({
    name:joi.string().required(),
    icon:joi.string().optional(),
    colour:joi.string().optional(),
    UserId:joi.string().optional,
})
module.exports.AddSubCategory = joi.object({
    name:joi.string().required(),
    CategoryID:joi.string().required(),
    image:joi.string().optional()

})
module.exports.updateCategory = joi.object({
    id:joi.string().required(),
    name:joi.string().required(),
    image:joi.string().optional(),
    icon:joi.string().optional(),
    colour:joi.string().optional()
})
module.exports.deleteCategory = joi.object({
    id:joi.string().optional(),
    name:joi.string().optional()
}).xor("id","name")
module.exports.UpdateSubCategory = joi.object({
    id:joi.string().required(),
    name:joi.string().required(),
    image:joi.string().optional(),
})
module.exports.deleteSubCategory= joi.object({
    id:joi.string().required()
})