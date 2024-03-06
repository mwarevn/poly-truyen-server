class HomeController {
    index(req, res, next) {
        res.render("home/index", { title: "Anh Minh" });
    }
}

module.exports = new HomeController();
