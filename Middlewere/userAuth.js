import jwt from 'jsonwebtoken';
import User from '../Models/user.model.js';

export let isAdmin = async (req, res, next) => {
    try {
        let token = req.cookies.token;
        if (!token) {
            return res.json({
                massage: "Token not available ...",
                success: false
            })
        }

        let decoded = jwt.verify(token, process.env.JWT_SECRET);
        let user = await User.findById(decoded.id);
        if (!user) {
            return res.status(403).json({
                message: "Access denied. Admins only.",
                success: false
            })  
        }

        req.user = user;
        next();

    } catch (error) {
        console.error(error);
    }
} 