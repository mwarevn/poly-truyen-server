responseError = (res, status, msg = "Unknow") => {
    res.status(status).json({ msg: msg });
};

module.exports = { responseError };
