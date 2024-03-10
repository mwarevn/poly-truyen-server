var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
    {
        username: { type: String, unique: true, required: true },
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true },
        fullName: { type: String, required: true },
        role: String,
    },
    { timestamps: true }
);

var userModel = mongoose.model("users", userSchema);

module.exports = userModel;
