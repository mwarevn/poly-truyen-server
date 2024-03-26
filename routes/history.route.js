var express = require("express");
var historyRouter = express.Router();
var historyCtrl = require("../controllers/history.controller");

historyRouter.get("/store", historyCtrl.saveCache);
historyRouter.get("/delete", historyCtrl.deleteCache);
historyRouter.get("/clear-cache/:idUser", historyCtrl.clearCache);
historyRouter.get("/:idUser", historyCtrl.getCaches);

module.exports = historyRouter;
