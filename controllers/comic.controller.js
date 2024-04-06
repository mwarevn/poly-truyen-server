const { response } = require("express");
const comicModel = require("../models/comic.model");
const { responseError } = require("../middlewares/ErrorHandle");
const commentModel = require("../models/comment.model");
const socketApi = require("../socket/socket-io");
const historyModel = require("../models/history.model");

class ComicController {
	async getAllComics(req, res) {
		try {
			// Tính tổng số lượt view của mỗi comic dựa trên lịch sử (history)
			const comicViews = await historyModel.aggregate([
				// Giải phóng mỗi mục trong mảng history thành các documents độc lập
				{ $unwind: "$history" },
				// Nhóm các documents theo id của comic và tính tổng số lượt view
				{ $group: { _id: "$history._id", totalViews: { $sum: 1 } } },
			]);

			const comicViewsMap = {};
			comicViews.forEach((item) => {
				comicViewsMap[item._id] = item.totalViews;
			});

			// Lấy danh sách comic từ DB và populate các thông tin cần thiết
			const comics = await comicModel.find({}).populate("cats").exec();

			// Tạo danh sách comic kèm theo số lượt view
			const listComics = comics.map((comic) => {
				const totalViews = comicViewsMap[comic._id.toString()];
				return {
					_id: comic._id,
					name: comic.name,
					desc: comic.desc,
					author: comic.author,
					poster: comic.poster,
					contents: comic.contents,
					cats: comic.cats,
					createdAt: comic.createdAt,
					views: totalViews || 0, // Nếu có lượt view thì trả về số lượt view đó, ngược lại trả về null
				};
			});

			res.json(listComics);
		} catch (error) {
			console.error("Error fetching comics:", error);
			responseError(res, 501, error);
		}
	}

	// getAllComics(req, res, next) {
	// 	comicModel
	// 		.find({})
	// 		.populate("cats")
	// 		.exec()
	// 		.then((comics) => {
	// 			if (comics) {
	// 				res.json(comics);
	// 			} else {
	// 				responseError(res, 501, "Lỗi không xác định từ server, không thể lấy danh sách truyện");
	// 			}
	// 		})
	// 		.catch((err) => {
	// 			responseError(res, 501, err);
	// 		});
	// }

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

	async getComicByTopComment(req, res) {
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

		try {
			// Tính tổng số lượt view của mỗi comic dựa trên lịch sử (history)
			const comicViews = await historyModel.aggregate([
				// Giải phóng mỗi mục trong mảng history thành các documents độc lập
				{ $unwind: "$history" },
				// Nhóm các documents theo id của comic và tính tổng số lượt view
				{ $group: { _id: "$history._id", totalViews: { $sum: 1 } } },
			]);

			const comicViewsMap = {};
			comicViews.forEach((item) => {
				comicViewsMap[item._id] = item.totalViews;
			});

			const comics = await commentModel.aggregate([
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
			]);

			if (comics) {
				var listComicId = comics.map((e) => e._id);
				comicModel
					.find({ _id: { $in: listComicId } })
					.populate("cats")
					.exec()
					.then((comics) => {
						// Tạo một bản đồ truyện với id làm key
						const comicMap = new Map(comics.map((comic) => [String(comic._id), comic]));
						// Tạo danh sách truyện sắp xếp từ bản đồ và loại bỏ các phần tử null
						const sortedComics = listComicId
							.map((id) => comicMap.get(String(id)))
							.filter((comic) => comic != null)
							.slice(0, 5);

						// Tạo danh sách comic kèm theo số lượt view
						const listComics = sortedComics.map((comic) => {
							const totalViews = comicViewsMap[comic._id.toString()];
							return {
								_id: comic._id,
								name: comic.name,
								desc: comic.desc,
								author: comic.author,
								poster: comic.poster,
								contents: comic.contents,
								count: comic.count || 0,
								cats: comic.cats,
								createdAt: comic.createdAt,
								views: totalViews || 0, // Nếu có lượt view thì trả về số lượt view đó, ngược lại trả về null
							};
						});

						res.json(listComics);
					});
			}
		} catch (error) {
			console.log("Error fetching comics:", error);
			responseError(res, 501, error);
		}

		// commentModel
		// 	.aggregate([
		// 		{
		// 			$match: {
		// 				createdAt: {
		// 					$gte: timeBefore,
		// 					$lte: time,
		// 				},
		// 			},
		// 		},
		// 		{
		// 			$group: {
		// 				_id: "$idComic",
		// 				count: { $sum: 1 },
		// 			},
		// 		},
		// 		{
		// 			$sort: { count: -1 }, // Sắp xếp từ nhiều nhất đến ít nhất
		// 		},
		// 	])
		// 	.then((comments) => {
		// 		if (comments) {
		// 			var listComicId = comments.map((e) => e._id);
		// 			comicModel
		// 				.find({ _id: { $in: listComicId } })
		// 				.populate("cats")
		// 				.exec()
		// 				.then((comics) => {
		// 					// Tạo một bản đồ truyện với id làm key
		// 					const comicMap = new Map(comics.map((comic) => [String(comic._id), comic]));
		// 					// Tạo danh sách truyện sắp xếp từ bản đồ và loại bỏ các phần tử null
		// 					const sortedComics = listComicId
		// 						.map((id) => comicMap.get(String(id)))
		// 						.filter((comic) => comic != null)
		// 						.slice(0, 5);
		// 					res.json(sortedComics);
		// 				})
		// 				.catch((err) => {
		// 					responseError(res, 501, err);
		// 				});
		// 		} else {
		// 			responseError(res, 501, "Lỗi không xác định từ server, không thể lấy danh sách truyện");
		// 		}
		// 	})
		// 	.catch((err) => {
		// 		responseError(res, 501, err);
		// 	});
	}
}

module.exports = new ComicController();
