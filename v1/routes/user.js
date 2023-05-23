const express = require("express");
const router = express.Router();
const userController = require("../controller");
const Auth = require("../../common/authentication");
const services = require("../services")

router.post("/singUp",userController.User.singup);
router.post("/forgotPassword",userController.User.forgotPassword);
router.post("/verifyOtp",userController.User.verifyOtp);
router.put("/profilesetup",userController.User.profileSetup);
router.post("/login",userController.User.login);
router.post("/passwordReset",Auth.verify("user"),userController.User.ResetPassword);
router.put("/changePassword",Auth.verify("user"),userController.User.changePassword);
router.get("/getProfile",Auth.verify("user"),userController.User.getProfile);
router.post("/resendOtp",Auth.verify("user"),userController.User.resendOtp);
router.post ("/logout",Auth.verify("user"),userController.User.logout);
router.delete ("/deleteProfile",Auth.verify("user"),userController.User.deleteUser);
router.put("/uploadimage",Auth.verify("user"),services.upload.upload.single("file"),userController.User.uploadFile);

// post tings
router.post("/keepPosting/:id",Auth.verify("user"),services.upload.upload.single("file"),userController.User.post_Detail);

module.exports = router;