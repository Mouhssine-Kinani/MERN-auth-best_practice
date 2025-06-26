import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: "Unauthorized - No token provided, please login first"
    })
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded) return res.status(401).json({
            success: false,
            message: "Unauthorized - Invalid token, please login again"
        })
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Server Error - Failed to verify token"
        })
    }
}