var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({});

var userModel = mongoose.model("users", userSchema);

module.exports = userModel;
