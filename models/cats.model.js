var mongoose = require("mongoose");

var catsSchema = new mongoose.Schema({
	name: { type: String, required: true },
});

var catsModel = mongoose.model("cats", catsSchema);

module.exports = catsModel;
