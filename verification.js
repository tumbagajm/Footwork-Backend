module.exports.validateEmail = (req, res, next) => {
    if (req.body.email.includes("@")) {
        next();
    } else {
        return res.status(400).send("Email invalid");
    }
};

module.exports.validateMobileNo = (req, res, next) => {
    if (req.body.mobileNo.length === 11) {
        next();
    } else {
        return res.status(400).send("Mobile number invalid");
    }
};

module.exports.validatePassword = (req, res, next) => {
    if (req.body.password.length >= 8) {
        next();
    } else {
        return res.status(400).send("Password must be atleast 8 characters");
    }
};