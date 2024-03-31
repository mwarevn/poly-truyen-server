var express = require("express");
var catsRouter = express.Router();
var catsCtrl = require("../controllers/cats.conttroller");

catsRouter.get("/get-all-cats", catsCtrl.getAllCats);
catsRouter.post("/create", catsCtrl.createCat);
catsRouter.put("/update/:id", catsCtrl.updateCat);
catsRouter.delete("/delete/:id", catsCtrl.removeCat);

module.exports = catsRouter;
