const { responseError } = require("../middlewares/ErrorHandle");
const commentModel = require("../models/comment.model");

class CommentController {
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
                // res.json(comment);

                commentModel
                    .findById(comment._id)
                    .populate("idUser")
                    .exec()
                    .then((newComment) => {
                        if (newComment) {
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
        console.log(123123);
        var id = req.params.id;

        commentModel
            .findByIdAndDelete(id)
            .then((success) => res.json(success))
            .catch((err) => responseError(res, 501, err));
    }
}

module.exports = new CommentController();
