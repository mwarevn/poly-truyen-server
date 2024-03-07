const comicRouter = require("./comic.route");
const homeRouter = require("./home.route");
const signRouter = require("./sign.route");

function routes(app) {
    app.use("/home", homeRouter);
    app.use("/sign", signRouter);
    app.use("/comic", comicRouter);
}

module.exports = routes;
