const jwt = require('jsonwebtoken');
const User = require('../models');
const dotenv = require('dotenv');
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables');
}

exports.authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'No Authorization header found'
            });
        }

        const [bearer, token] = authHeader.split(' ');

        if (bearer !== 'Bearer' || !token) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid Authorization header format'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: ['id', 'role']
        });

        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'User not found'
            });
        }

        req.user = {
            id: user.id,
            role: user.role
        };

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid token'
            });
        }

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};


exports.checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user?.role) {
            return res.status(403).json({
                status: 'error',
                message: 'Access denied: No role information'
            });
        }

        if (roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                status: 'error',
                message: `Access denied: Required role(s): ${roles.join(', ')}`
            });
        }
    };
};