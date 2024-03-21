var express = require("express");
var signRouter = express.Router();
var signCtrl = require("../controllers/sign.controller");

signRouter.post("/in", signCtrl.signIn);
signRouter.post("/up", signCtrl.signUp);

signRouter.get(["/in", "/"], (req, res) => res.render("sign/signIn.ejs"));
signRouter.get("/up", (req, res) => res.render("sign/signUp.ejs"));

module.exports = signRouter;
