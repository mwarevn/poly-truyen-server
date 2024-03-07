var mongoose = require("mongoose");
const commentModel = require("./comment.model");

var comicSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        desc: String,
        author: String,
        poster: String,
        contents: [String],
    },
    {
        timestamps: true,
    }
);

var comicModel = mongoose.model("comics", comicSchema);

module.exports = comicModel;
