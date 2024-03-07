const userModel = require("../models/user.model");

class SignController {
    async signIn(req, res) {
        var loginPayload = req.body;
        console.log(loginPayload);
        var validUser = null;

        try {
            if (loginPayload.email.includes("@")) {
                validUser = await userModel.findOne({ email: loginPayload.email, password: loginPayload.password });
            } else {
                validUser = await userModel.findOne({ username: loginPayload.email, password: loginPayload.password });
            }

            if (validUser && validUser.role == "admin") {
                res.json(validUser);
            } else {
                res.status(501).json({ msg: "Username/Email or password is invalid!" });
            }
        } catch (error) {
            res.status(501).json({ msg: "Unknow error from server please contact to admin!" + error });
        }
    }

    signUp(req, res) {}
}

module.exports = new SignController();
