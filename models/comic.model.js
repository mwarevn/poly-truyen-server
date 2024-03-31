var mongoose = require("mongoose");

var comicSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		desc: String,
		author: String,
		poster: String,
		contents: [String],
		cats: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "cats" },
	},
	{
		timestamps: true,
	}
);

var comicModel = mongoose.model("comics", comicSchema);

module.exports = comicModel;
