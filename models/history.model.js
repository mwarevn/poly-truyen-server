var mongoose = require("mongoose");
const comicModel = require("./comic.model");

var historySchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId },
		history: [comicModel.schema],
	},
	{ timestamps: true }
);

var historyModel = mongoose.model("histories", historySchema);

module.exports = historyModel;
