var express = require("express");
var userRouter = express.Router();
var userCtrl = require("../controllers/user.controller");

userRouter.get("/get-all", userCtrl.getAllUsers);
userRouter.post("/create", userCtrl.createUser);
userRouter.put("/update/:id", userCtrl.updateUser);
userRouter.delete("/delete/:id", userCtrl.deleteUserById);

module.exports = userRouter;
