const {User, Sponsorship, Donation, Orphan} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @module services/user
 * @description Service functions for user-related operations
 */

/**
 * Generate a JWT token for a user
 * @function generateToken
 * @param {Object} user - User object
 * @param {number} user.id - User ID
 * @returns {string} JWT token
 * @private
 */
const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '30d'});
};

/**
 * Register a new user
 * @async
 * @function register
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {string} [req.body.role='donor'] - User's role
 * @param {string} [req.body.phone] - User's phone number
 * @param {string} [req.body.address] - User's address
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created user details and JWT token
 */
exports.register = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await User.findOne({where: {email}});
        if (existingUser) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: 'User already exists'});
        }

        const user = req.body;
        const token = generateToken(user);
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: 'Invalid token'
            });
        }
        await User.create(req.body);

        res.status(HTTP_STATUS.CREATED).json({
            message: "user registered successfully", user: user, token
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Authenticate a user and generate JWT token
 * @async
 * @function login
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user details and JWT token
 */
exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'User not found'});
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({message: 'Invalid credentials'});
        }

        const token = generateToken(user);

        res.status(HTTP_STATUS.OK).json({
            message: 'Login successful', user: {
                id: user.id, name: user.name, email: user.email, role: user.role
            }, token
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get the current authenticated user's profile
 * @async
 * @function getCurrentUserProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user profile details
 */
exports.getCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: {exclude: ['password']}
        });

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'User not found'});
        }

        res.status(HTTP_STATUS.OK).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
            profileImage: user.profileImage
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Update the current authenticated user's profile
 * @async
 * @function updateCurrentUserProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Updated name
 * @param {string} [req.body.phone] - Updated phone number
 * @param {string} [req.body.address] - Updated address
 * @param {Object} [req.file] - Uploaded profile image file
 * @param {string} [req.file.filename] - Filename of the uploaded profile image
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated user profile details
 */
exports.updateCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'User not found'});
        }
        const {name, phone, address} = req.body;

        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;

        if (req.file) {
            user.profileImage = `/uploads/profiles/${req.file.filename}`;
        }

        await user.save();

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile updated successfully', user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                address: user.address,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete the current authenticated user's profile
 * @async
 * @function deleteCurrentUserProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteCurrentUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) return res.status(404).json({message: 'User not found'});

        await user.destroy();
        res.json({message: 'Your account has been deleted'});
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Delete a user by ID (admin function)
 * @async
 * @function deleteUserById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - User ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "User not found"});
        }

        await user.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "user deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Get all users with pagination (admin function)
 * @async
 * @function getUsers
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated users list
 */
exports.getUsers = async function (req, res) {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await User.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "User not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
}

/**
 * Get a user by ID
 * @async
 * @function getUserById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - User ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user details
 */
exports.getUserById = async function (req, res) {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "User not found"});
        }

        res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Calculate dashboard statistics from donations and sponsorships
 * @function calculateDashboardStats
 * @param {Array<Object>} donations - Array of donation objects
 * @param {Array<Object>} sponsorships - Array of sponsorship objects
 * @returns {Object} Dashboard statistics
 * @returns {number} .totalDonations - Total number of donations
 * @returns {number} .totalDonated - Total amount donated
 * @returns {number} .activeSponshorships - Number of active sponsorships
 * @private
 */
const calculateDashboardStats = (donations, sponsorships) => {
    const totalDonated = donations.reduce((sum, donation) =>
        sum + parseFloat(donation.amount), 0);
    return {
        totalDonations: donations.length,
        totalDonated: totalDonated,
        activeSponshorships: sponsorships.filter(s => s.status === 'active').length
    };
};

/**
 * Get user dashboard with donations and sponsorships
 * @async
 * @function getDashboard
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user dashboard data
 */
exports.getDashboard = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'User not found'});
        }

        const donationsResult = await Donation.findAndCountAll({
            where: {donorId: req.user.id},
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const sponsorshipsResult = await Sponsorship.findAndCountAll({
            where: {sponsorId: req.user.id},
            include: [{model: Orphan, attributes: ['id', 'name', 'age', 'gender', 'profileImage']}],
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        const stats = calculateDashboardStats(donations, sponsorships);

        res.status(HTTP_STATUS.OK).json({
            donorInfo: {
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            },
            stats,
            donations: formatPaginatedResponse(donationsResult, page, limit),
            sponsorships: formatPaginatedResponse(sponsorshipsResult, page, limit)
        });
    } catch (error) {
        handleError(res, error);
    }
};
