var express = require("express");
var historyRouter = express.Router();
var historyCtrl = require("../controllers/history.controller");

historyRouter.get("/:idUser", historyCtrl.getCaches);
historyRouter.get("/store", historyCtrl.saveCache);
historyRouter.get("/delete", historyCtrl.deleteCache);

module.exports = historyRouter;
