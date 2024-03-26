const { responseError } = require("../middlewares/ErrorHandle");
const userModel = require("../models/user.model");

class UserController {
	getAllUsers(req, res) {
		userModel
			.find({})
			.then((users) => {
				// res.json(users.filter((e) => e.role != "admin"));
				res.json(users.filter((e) => e));
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}

	async createUser(req, res) {
		var userPayload = req.body;
		var existsUser = null;

		if (
			userPayload.email == "" ||
			userPayload.username == "" ||
			userPayload.password == "" ||
			userPayload.fullName == ""
		) {
			responseError(res, 501, "Vui lòng không bỏ trống thông tin!");
			return;
		}

		existsUser = await userModel.findOne({ email: userPayload.email });

		if (existsUser) {
			responseError(res, 501, "Email hoặc username đã tồn tại trong hệ thống!");
			return;
		}

		existsUser = await userModel.findOne({ username: userPayload.username });

		if (existsUser) {
			responseError(res, 501, "Email hoặc username đã tồn tại trong hệ thống!");
			return;
		}

		userModel
			.create(userPayload)
			.then((newCreatedUser) => {
				res.json(newCreatedUser);
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}

	async updateUser(req, res) {
		var userPayload = req.body;
		var id = req.params.id;
		var existsUser = null;

		if (
			userPayload.email == "" ||
			userPayload.username == "" ||
			userPayload.password == "" ||
			userPayload.fullName == ""
		) {
			responseError(res, 501, "Vui lòng không bỏ trống thông tin!");
			return;
		}

		existsUser = await userModel.findOne({ email: userPayload.email });

		if (existsUser && existsUser.email != userPayload.email) {
			responseError(res, 501, "Email hoặc username đã tồn tại trong hệ thống!");
			return;
		}

		existsUser = await userModel.findOne({ username: userPayload.username });

		if (existsUser && existsUser.username != userPayload.username) {
			responseError(res, 501, "Email hoặc username đã tồn tại trong hệ thống!");
			return;
		}

		userModel
			.findByIdAndUpdate(id, userPayload, { new: true })
			.then((newCreatedUser) => {
				res.json(newCreatedUser);
			})
			.catch((err) => {
				responseError(res, 501, err);
			});
	}

	deleteUserById(req, res) {
		const id = req.params.id;
		userModel
			.findByIdAndDelete(id)
			.then((success) => {
				res.json(success);
			})
			.catch((err) => responseError(res, 501, "Không thể xóa user này, vui lòng thử lại sau!"));
	}
}

module.exports = new UserController();
