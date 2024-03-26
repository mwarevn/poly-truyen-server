const { error } = require("shelljs");
const comicModel = require("../models/comic.model");
const historyModel = require("../models/history.model");
const { responseError } = require("../middlewares/ErrorHandle");

class HistoriesController {
	getCaches(req, res) {
		let isUser = req.params.idUser;
		historyModel
			.findOne({ user: isUser })
			.then((caches) => res.json(caches.history))
			.catch((error) => responseError(res, 501, error));
	}

	async saveCache(req, res) {
		let user = req.query.user;
		let comic = req.query.comic;

		let existsCache = await historyModel.findOne({ user });
		let comicInfo = await comicModel.findById(comic);
		if (!existsCache) {
			historyModel.create({ user, history: [comicInfo] });
			res.json({ message: "Create history successfully!" });
		} else {
			existsCache.history.map((e, i) => {
				if (e._id == comic) {
					existsCache.history.splice(i, 1);
					return;
				}
			});

			existsCache.history.push(comicInfo);

			historyModel
				.findByIdAndUpdate(existsCache._id, existsCache, { new: true })
				.then((newCache) => res.json({ newCache }))
				.catch((error) => responseError(res, 501, error));
		}
	}

	deleteCache(req, res) {
		let user = req.query.user;
		let comic = req.query.comic;

		historyModel
			.findOne({ user })
			.then((cache) => {
				cache.history.map((e, i) => {
					if (e._id == comic) {
						cache.history.splice(i, 1);
						return;
					}
				});

				historyModel
					.findByIdAndUpdate(cache._id, cache, { new: true })
					.then((newCache) => res.json({ newCache }))
					.catch((error) => responseError(res, 501, error));
			})
			.catch((error) => responseError(res, 501, error));
	}
}

module.exports = new HistoriesController();
