var express = require("express");
var homeRouter = express.Router();
var homeCtrl = require("../controllers/home.controller");

homeRouter.get("/", homeCtrl.index);

module.exports = homeRouter;
