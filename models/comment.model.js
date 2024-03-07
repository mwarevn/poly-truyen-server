var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema(
    {
        idComic: { type: mongoose.Schema.ObjectId, required: true },
        idUser: { type: mongoose.Schema.ObjectId, required: true },
        contents: String,
    },
    {
        timestamps: true,
    }
);

var commentModel = mongoose.model("comments", commentSchema);

module.exports = commentModel;
