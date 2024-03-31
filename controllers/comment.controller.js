const { responseError } = require("../middlewares/ErrorHandle");
const commentModel = require("../models/comment.model");
const socketApi = require("../socket/socket-io");

class CommentController {
	// [GET] /comment/get-all - get all comments
	async getAllComments(req, res, next) {
		commentModel
			.find({})
			.then((comments) => {
				if (comments) {
					res.json(comments);
					return;
				}
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}

	// [GET] /comment/comic/:id
	async getCommentsOfComicById(req, res, next) {
		var idComic = req.params.id;

		commentModel
			.find({ idComic: idComic })
			.populate("idUser")
			.exec()
			.then((comments) => {
				if (comments) {
					res.json(comments);
					return;
				}
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}

	create(req, res) {
		var commentPayload = req.body;

		commentModel
			.create(commentPayload)
			.then((comment) => {
				commentModel
					.findById(comment._id)
					.populate("idUser")
					.exec()
					.then((newComment) => {
						if (newComment) {
							socketApi.io.emit("update_comment", comment.idComic);
							res.json(newComment);
							return;
						}
					})
					.catch((err) => {
						responseError(res, 501, err);
					});
			})
			.catch((err) => responseError(res, 501, err));
	}

	// [DELETE] /comment/delete/:id
	deleteCommentById(req, res) {
		var id = req.params.id;

		commentModel
			.findByIdAndDelete(id)
			.then((comment) => {
				socketApi.io.emit("update_comment", comment.idComic);
				res.json({ message: "Delete comment successfully!" });
			})
			.catch((err) => responseError(res, 501, err));
	}

	// [PUT] /comment/update/:id
	updateCommentById(req, res) {
		var id = req.params.id;
		var commentPayload = req.body;

		commentModel
			.findByIdAndUpdate(id, commentPayload, { new: true })
			.then((comment) => {
				commentModel
					.findById(comment._id)
					.populate("idUser")
					.exec()
					.then((newComment) => {
						if (newComment) {
							socketApi.io.emit("update_comment", newComment.idComic);
							res.json(newComment);
							return;
						}
					})
					.catch((err) => {
						responseError(res, 501, err);
					});
			})
			.catch((err) => responseError(res, 501, err));
	}
}

module.exports = new CommentController();
