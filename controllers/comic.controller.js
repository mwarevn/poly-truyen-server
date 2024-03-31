const { response } = require("express");
const comicModel = require("../models/comic.model");
const { responseError } = require("../middlewares/ErrorHandle");
const commentModel = require("../models/comment.model");
const socketApi = require("../socket/socket-io");

class ComicController {
	getAllComics(req, res, next) {
		comicModel
			.find({})
			.populate("cats")
			.exec()
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
			.then(async (newComic) => {
				var comics = await comicModel.findById(newComic._id).populate("cats").exec();

				if (comics) {
					socketApi.io.emit("ServerPostNewComic", JSON.stringify(comics));
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

		if (req.files["poster"] && req.files["poster"].length != 0) {
			comicPayload.poster = req.files["poster"][0].filename;
		}

		if (req.files["contents"] && req.files["contents"].length != 0) {
			comicPayload.contents = req.files["contents"].map((e) => e.filename);
		}

		comicModel
			.findByIdAndUpdate(id, comicPayload, { new: true })
			.then(async (comic) => {
				var newComicData = await comicModel.findById(comic._id).populate("cats").exec();

				if (newComicData) {
					socketApi.io.emit("changeListComic", "Change list comic");
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
			.populate("cats")
			.exec()
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

	async deleteComicById(req, res) {
		var id = req.params.id;

		var deletedComic = await comicModel.findByIdAndDelete(id);

		if (deletedComic) {
			commentModel
				.deleteMany({ idComic: id })
				.then((deletedComments) => {
					socketApi.io.emit("changeListComic", "Change list comic");
					res.json(deletedComments);
				})
				.catch((err) => {
					responseError(res, 501, +err);
				});
		} else {
			responseError(res, 501, "Lỗi không thể xóa truyện này!");
		}
	}

	// [GET] /comic/top-popular/:top

	getComicByTopComment(req, res) {
		var top = req.params.top;
		var time = new Date();
		var timeBefore = new Date();

		switch (top) {
			case "day":
				timeBefore.setDate(time.getDate() - 1);
				break;
			case "week":
				timeBefore.setDate(time.getDate() - 7);
				break;
			case "month":
				timeBefore.setMonth(time.getMonth() - 1);
				break;
			default:
				responseError(res, 501, "Lỗi không xác định top popular!");
				return;
		}

		commentModel
			.aggregate([
				{
					$match: {
						createdAt: {
							$gte: timeBefore,
							$lte: time,
						},
					},
				},
				{
					$group: {
						_id: "$idComic",
						count: { $sum: 1 },
					},
				},
				{
					$sort: { count: -1 },
				},
			])
			.then((comments) => {
				if (comments) {
					var listComicId = comments.map((e) => e._id);
					comicModel
						.find({ _id: { $in: listComicId } })
						.populate("cats")
						.exec()
						.then((comics) => {
							res.json(comics);
						})
						.catch((err) => {
							responseError(res, 501, err);
						});
				} else {
					responseError(res, 501, "Lỗi không xác định từ server, không thể lấy danh sách truyện");
				}
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}
}

module.exports = new ComicController();
