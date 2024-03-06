const homeRouter = require("./home.route");

function routes(app) {
    app.use("/home", homeRouter)
}

module.exports = routes