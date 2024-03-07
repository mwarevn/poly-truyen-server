var express = require("express");
var comicRouter = express.Router();
var comicCtrl = require("../controllers/comic.controller");
var multer = require("multer");
var pathToSaveImage = __dirname.split("routes")[0] + "public/images";

// Define storage for uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pathToSaveImage);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage }).fields([
    { name: "poster", maxCount: 1 },
    { name: "contents", maxCount: 1000 },
]);

comicRouter.get("/read/:id", comicCtrl.readComicById);
comicRouter.get("/get-all-comics", comicCtrl.getAllComics);
comicRouter.get("/:id", comicCtrl.getComicbyId);
comicRouter.post("/create", upload, comicCtrl.createNewComic);
comicRouter.post("/update/:id", upload, comicCtrl.updateComicById);

module.exports = comicRouter;
