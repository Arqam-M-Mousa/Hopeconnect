const { Volunteer, VolunteerService } = require('../models');
const { Op, where} = require('sequelize');
const sequelize = require('../config/database');
const { formatPaginatedResponse, getPaginationParams } = require('../utils/pagination');
const { HTTP_STATUS, handleError } = require('../utils/responses');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (volunteer) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign({ id: volunteer.id }, JWT_SECRET, { expiresIn: '30d' });
    return token;
};

// Register
exports.register = async (req, res) => {
    try {
        const email = req.body.email;
        const existingVolunteer = await Volunteer.findOne({where: {email}});
        if (existingVolunteer) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Volunteer already exists"});
        }
        const volunteer = req.body;
        const token = generateToken(volunteer);
        if (!token) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                message: 'Invalid token'
            });
        }
        const createdVolunteer = await Volunteer.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Volunteer registered successfully",
            user: createdVolunteer,
            token
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const volunteer = await Volunteer.findOne({where:email});
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        const isPasswordValid = await volunteer.validatePassword(password);
        if (!isValid) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: 'Invalid credentials' });

        const token = generateToken(volunteer);

        res.status(HTTP_STATUS.OK).json({
            message: 'Login successful',
            volunteer: {
                id: volunteer.id,
                name: volunteer.name,
                email: volunteer.email,
                role: volunteer.role
            },
            token
        });
    } catch (error) {
        handleError(res, error);
    }
};

// Profile
exports.getCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile updated successfully',
            volunteer: {
                id: volunteer.id,
                userId: volunteer.userId,
                servicesOffered: volunteer.servicesOffered,
                availability: volunteer.availability,
                preferredLocation: volunteer.preferredLocation,
                skills: volunteer.skills,
                experience: volunteer.experience,
                verified: volunteer.verified,
                createdAt: volunteer.createdAt,
                updatedAt: volunteer.updatedAt
            }
        });

    } catch (error) {
        handleError(res, error);
    }
};

exports.updateCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        const { name, phone, address } = req.body;
        if (name) volunteer.name = name;
        if (phone) volunteer.phone = phone;
        if (address) volunteer.address = address;

        await volunteer.save();

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile updated successfully',
            volunteer: {
                id: volunteer.id,
                userId: volunteer.userId,
                servicesOffered: volunteer.servicesOffered,
                availability: volunteer.availability,
                preferredLocation: volunteer.preferredLocation,
                skills: volunteer.skills,
                experience: volunteer.experience,
                verified: volunteer.verified,
                createdAt: volunteer.createdAt,
                updatedAt: volunteer.updatedAt
            }
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        await volunteer.destroy();
        res.json({ message: 'Your account has been deleted' });
    } catch (error) {
        handleError(res, error);
    }
};

// Admin functions
exports.getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });
        res.json(volunteer);
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        await volunteer.destroy();
        res.json({ message: 'Volunteer deleted' });
    } catch (error) {
        handleError(res, error);
    }
};

exports.verifyVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(404).json({ message: 'Volunteer not found' });

        volunteer.verified = true;
        await volunteer.save();
        res.json({ message: 'Volunteer verified' });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getVolunteers = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const result = await Volunteer.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

// Services (skills) management
exports.getServices = async (req, res) => {
    try {
        const services = await VolunteerService.findAll({ where: { volunteerId: req.user.id } });
        res.json(services);
    } catch (error) {
        handleError(res, error);
    }
};

exports.addService = async (req, res) => {
    try {
        const service = await VolunteerService.create({
            volunteerId: req.user.id,
            ...req.body
        });
        res.status(201).json(service);
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateService = async (req, res) => {
    try {
        const service = await VolunteerService.findOne({
            where: { id: req.params.serviceId, volunteerId: req.user.id }
        });
        if (!service) return res.status(404).json({ message: 'Service not found' });

        await service.update(req.body);
        res.json(service);
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await VolunteerService.findOne({
            where: { id: req.params.serviceId, volunteerId: req.user.id }
        });
        if (!service) return res.status(404).json({ message: 'Service not found' });

        await service.destroy();
        res.json({ message: 'Service deleted' });
    } catch (error) {
        handleError(res, error);
    }
};

// Search + Available volunteers (admin)
exports.searchVolunteers = async (req, res) => {
    try {
        const { skill, availability } = req.query;

        const result = await Volunteer.findAll({
            where: {
                ...(availability && { availability }),
            },
            include: [
                {
                    model: VolunteerService,
                    where: skill ? { name: { [Op.like]: `%${skill}%` } } : {},
                    required: !!skill
                }
            ]
        });

        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAvailableVolunteers = async (req, res) => {
    try {
        const result = await Volunteer.findAll({ where: { availability: true } });
        res.json(result);
    } catch (error) {
        handleError(res, error);
    }
};
