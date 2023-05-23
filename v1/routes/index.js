const express = require("express");
const router = express.Router();
const userRoutes = require("./user");
const AdminRoutes = require("./Admin");

router.use("/user",userRoutes);
router.use("/Admin",AdminRoutes);

module.exports= router;