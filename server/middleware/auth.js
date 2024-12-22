const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        
        // Check if token is provided
        if (!token) {
            return res.status(401).json({ msg: "No token provided, authorization denied" });
        }

        // Ensure token starts with "Bearer " prefix
        if (!token.startsWith("Bearer ")) {
            return res.status(401).json({ msg: "Invalid token format, use 'Bearer <token>'" });
        }

        // Remove "Bearer " prefix and verify the token
        const tokenWithoutBearer = token.split(" ")[1];
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: "Invalid token, authorization denied", error: error.message });
    }
};

module.exports = authMiddleware;
