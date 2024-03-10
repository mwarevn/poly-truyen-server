var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
    {
        idComic: { type: String, required: true },
        idUser: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
        content: String,
    },
    {
        timestamps: true,
    }
);

var commentModel = mongoose.model("comments", commentSchema);

module.exports = commentModel;
