const JWT = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const token = req.header("token")
        // console.log(req.header['auth-token'])
    if (!token) return res.status(401).json({
        message: "Unauthorized access",
    });
    try {
        const verified = JWT.verify(token, process.env.jwtSecret);
        req.user = verified;
        if (req.user.userType === "deliveryPerson") {
            next();
        } else {
            return res.status(401).json({
                message: "Unauthorized access",
            });

        }
    } catch (err) {
        return res.status(401).json({
            message: "Unauthorized access",
        });
    }
};