const jwt = require("jsonwebtoken");
const Model = require("../models");

module.exports.getToken = (data) =>
  jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30 days"
  });

module.exports.getVerifyToken = (data) =>
  jwt.sign(data, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "2h"
  });

module.exports.verifyToken = (token) =>
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

module.exports.verify = (...args) => async (req, res, next) => {
  try {
    let roles = [].concat(args).map((role) => role.toLowerCase());
    const token = String(req.headers.authorization || "")
      .replace(/bearer|jwt|Guest/i, "")
      .replace(/^\s+|\s+$/g, "");

    let doc = null;
    let role = "";
    let decoded = null
    if (roles.includes("guest")) {
      if (token != null && token != 'null' && token != undefined && token != "" ) {
        roles = "user"
      } else {
        return next();
      }
    }
    if (req.headers.authorization && req.headers.authorization.includes("Guest")) {
      console.log("in guest",req.headers.authorization)
      role = "user";
      doc = await Model.User.findOne({
        guestToken: token,
        isGuest: true,
        isBlocked: false,
        isDeleted: false,
      });
      if (doc == null) {
        doc = await Model.User({
          guestToken: token,
          isGuest: true
        }).save()
      }
    } else {
      decoded = this.verifyToken(token);
    }
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",token);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>,",decoded);
    console.log("....................................................................",roles)

    if (decoded != null && roles.includes("user")) {
      role = "user";
      doc = await Model.User.findOne({
        _id: decoded._id,
        jti: decoded.jti,
        isDeleted: false,
      });
    }


    if (decoded != null && roles.includes("admin")) {
      role = "admin";
      doc = await Model.Admin.findOne({
        _id: decoded._id,
        jti: decoded.jti,
        isBlocked: false,
        isDeleted: false,
      });
    }
    if (!doc) {
      return res.status(401).send({
        "statusCode": 401,
        "message": "UNAUTHORIZED ACCESS",
        // "data": {},
        "status": 0,
        "isSessionExpired": true
      })
    };
    if (role) req[role] = doc.toJSON();
    next();
  } catch (error) {
    console.error(error);
    const message =
      String(error.name).toLowerCase() === "error" ?
      error.message :
      "UNAUTHORIZED ACCESS";
    return res.error(401, message);
  }
};