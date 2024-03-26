var express = require("express");
var userRouter = express.Router();
var userCtrl = require("../controllers/user.controller");
var multer = require("multer");

var pathToSaveImage = __dirname.split("routes")[0] + "public/images";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, pathToSaveImage);
	},
	filename: function (req, file, cb) {
		cb(null, "user-avatar" + Date.now() + "-" + file.originalname);
	},
});

const upload = multer({ storage: storage });

userRouter.get("/get-all", userCtrl.getAllUsers);
userRouter.post("/create", userCtrl.createUser);
userRouter.put("/update/:id", upload.single("avatar"), userCtrl.updateUser);
userRouter.delete("/delete/:id", userCtrl.deleteUserById);

module.exports = userRouter;
