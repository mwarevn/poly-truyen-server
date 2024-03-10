var express = require("express");
var commentRouter = express.Router();
var commentCtrl = require("../controllers/comment.controller");

commentRouter.get("/comic/:id", commentCtrl.getCommentsOfComicById);
commentRouter.post("/create", commentCtrl.create);

module.exports = commentRouter;
