const express = require("express");
const router = express.Router();
const AdminController = require("../controller");
const Auth = require("../../common/authentication");
const services = require("../services")
//Admin on bording.................
router.post("/signUp",AdminController.Admin.signUp);
router.post("/forgotPassword",AdminController.Admin.forgotPassword);
router.post("/verifyOtp",AdminController.Admin.verifyOtp);
router.put("/profilesetup",AdminController.Admin.profileSetup);
router.post ("/login",AdminController.Admin.login);
router.post("/passwordReset",Auth.verify("ADMIN"),AdminController.Admin.ResetPassword);
router.post("/changePassword",Auth.verify("ADMIN"),AdminController.Admin.changePassword);
router.post("/resendOtp",Auth.verify("ADMIN"),AdminController.Admin.resendOtp);
router.get("/getProfile",Auth.verify("ADMIN"),AdminController.Admin.getProfile);
router.post ("/logout",Auth.verify("ADMIN"),AdminController.Admin.logout);
router.delete ("/deleteProfile",Auth.verify("ADMIN"),AdminController.Admin.deleteUser);
router.put("/uploadimage",Auth.verify("ADMIN"),AdminController.Admin.uploadFile);

//ADD category and sub Category********************************

router.post("/addCategory",Auth.verify("ADMIN"),AdminController.Admin.Add_Category);
router.put("/updateCategory",Auth.verify("ADMIN"),AdminController.Admin.UpdateCategory);
router.delete("/deleteCategory",Auth.verify("ADMIN"),AdminController.Admin.deleteCategory);

router.post("/addSubCategory",Auth.verify("ADMIN"),AdminController.Admin.Add_SubCategory);
router.put("/updateSubCategory",Auth.verify("ADMIN"),AdminController.Admin.UpdateSubCategory);
router.delete("/deleteSubCategory",Auth.verify("ADMIN"),AdminController.Admin.deleteSubCategory);
module.exports =router;