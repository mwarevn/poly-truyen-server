class HomeController {
    index(req, res, next) {
        var page = req.query.page;

        res.render("home/index", { page });
    }
}

module.exports = new HomeController();
