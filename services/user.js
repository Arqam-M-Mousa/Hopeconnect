const {User, Sponsorship , Donation , Orphan} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    return jwt.sign({id: user.id}, JWT_SECRET, {expiresIn: '30d'});
};

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

        await user.update();

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
        handleError(error);
    }
};

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

exports.deleteUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "user not found"});
        }

        await user.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "user deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
}

exports.getUsers = async function (req, res) {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await User.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphan not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
}

exports.getUserById = async function (req, res) {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "user not found"});
        }

        res.status(HTTP_STATUS.OK).json(user);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getDashboard = async  (req , res) => {
    try {
        const user = await User.findByPk(req.userId);

        const donations = await Donation.findAll({
            where: { donorId: req.userId }
        });

        const sponsorships = await Sponsorship.findAll({
            where: { sponsorId: req.userId },
            include: [{ model: Orphan, attributes: ['id', 'name', 'age', 'gender', 'profileImage'] }]
        });

        const totalDonated = donations.reduce((sum, donation) =>
            sum + parseFloat(donation.amount), 0);

        res.status(HTTP_STATUS.OK).json({
            donorInfo: {
                name: user.name,
                email: user.email,
                profileImage: user.profileImage
            },
            stats: {
                totalDonations: donations.length,
                totalDonated: totalDonated,
                activeSponshorships: sponsorships.filter(s => s.status === 'active').length
            },
            recentDonations: donations.slice(-5),
            sponsorships: sponsorships
        });
    } catch (error) {
        handleError(res, error);
    }
};