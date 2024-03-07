const { response } = require("express");
const comicModel = require("../models/comic.model");
const { responseError } = require("../middlewares/ErrorHandle");

class ComicController {
    getAllComics(req, res, next) {
        comicModel
            .find({})
            .then((comics) => {
                if (comics) {
                    res.json(comics);
                } else {
                    responseError(res, 501, "Lỗi không xác định từ server, không thể lấy danh sách truyện");
                }
            })
            .catch((err) => {
                responseError(res, 501, err);
            });
    }

    createNewComic(req, res) {
        var comicPayload = {
            ...req.body,
            poster: req.files["poster"][0].filename,
            contents: req.files["contents"].map((e) => e.filename),
        };

        comicModel
            .create(comicPayload)
            .then((comic) => {
                if (comic) {
                    res.redirect("back");
                } else {
                    responseError(res, 501, "Lỗi không thể tạo mới truyện!");
                }
            })
            .catch((err) => {
                responseError(res, 501, err);
            });
    }

    updateComicById(req, res) {
        var id = req.params.id;
        var comicPayload = {
            ...req.body,
        };

        console.log(req.files);

        if (req.files["poster"] && req.files["poster"].length != 0) {
            comicPayload.poster = req.files["poster"][0].filename;
        }

        if (req.files["contents"] && req.files["contents"].length != 0) {
            comicPayload.contents = req.files["contents"].map((e) => e.filename);
        }

        comicModel
            .findByIdAndUpdate(id, comicPayload)
            .then((comic) => {
                if (comic) {
                    res.redirect("back");
                } else {
                    responseError(res, 501, "Lỗi không thể update truyện!");
                }
            })
            .catch((err) => {
                responseError(res, 501, err);
            });
    }

    readComicById(req, res) {
        var id = req.params.id;
        res.render("comic/readComic.ejs", { id });
    }

    getComicbyId(req, res) {
        var id = req.params.id;

        comicModel
            .findById(id)
            .then((comic) => {
                if (!comic) {
                    responseError(res, 501, "Lỗi không thể lấy thông tin của comic này!");
                    return;
                }

                res.json(comic);
            })
            .catch((err) => {
                responseError(res, 501, err);
            });
    }
}

module.exports = new ComicController();
