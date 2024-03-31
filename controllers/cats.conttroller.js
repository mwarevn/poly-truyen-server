const { responseError } = require("../middlewares/ErrorHandle");
const catsModel = require("../models/cats.model");

class CatsController {
	// [GET] /cats - Get all cats
	getAllCats(req, res, next) {
		catsModel
			.find()
			.then((cats) => {
				res.json(cats);
			})
			.catch(() => responseError(res, 501, "Error when get all cats"));
	}

	createCat(req, res) {
		catsModel
			.create(req.body)
			.then((cat) => res.json(cat))
			.catch(() => responseError(res, 501, "Error when create cat"));
	}

	updateCat(req, res) {
		let id = req.params.id;
		let name = req.body.name;

		catsModel
			.findByIdAndUpdate(id, { name: name })
			.then((cat) => res.json(cat))
			.catch(() => responseError(res, 501, "Error when update cat"));
	}

	removeCat(req, res) {
		let id = req.params.id;

		catsModel
			.findByIdAndDelete(id)
			.then(() => res.json({ message: "Remove cat successfully" }))
			.catch(() => responseError(res, 501, "Error when remove cat"));
	}
}

module.exports = new CatsController();
