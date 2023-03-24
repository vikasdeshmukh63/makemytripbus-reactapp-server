const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.send({
            message: "Authorization failed",
            success: false
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.userId;
    next();
    } catch (error) {
        return res.send({
            message: "Authorization failed with error",
            success: false
        });
    }
}