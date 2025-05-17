const { Volunteer,OrphanageHelpRequest } = require('../models');
const { Op } = require('sequelize');
const { formatPaginatedResponse, getPaginationParams } = require('../utils/pagination');
const { HTTP_STATUS, handleError } = require('../utils/responses');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

exports.getCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile fetched successfully',
            volunteer
        });

    } catch (error) {
        handleError(res, error);
    }
};

exports.updateCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        const updatableFields = [
            'servicesOffered',
            'availability',
            'preferredLocation',
            'skills',
            'experience'
        ];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                volunteer[field] = req.body[field];
            }
        });

        await volunteer.save();

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile updated successfully',
            volunteer
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
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

        await volunteer.destroy();
        res.json({ message: 'Volunteer deleted' });
    } catch (error) {
        handleError(res, error);
    }
};

exports.verifyVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });

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

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};



exports.searchVolunteers = async (req, res) => {
    try {
        const { skill, availability } = req.query;

        const volunteers = await Volunteer.findAll({
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

        res.json(volunteers);
    } catch (error) {
        handleError(res, error);
    }
};
exports.updateVolunteerById = async (req, res) => {
    try {
        const volunteerId = req.params.id;
        const volunteer = await Volunteer.findByPk(volunteerId);
        if (!volunteer) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });
        }

        const allowedFields = [
            'servicesOffered',
            'availability',
            'preferredLocation',
            'skills',
            'experience'
        ];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                volunteer[field] = req.body[field];
            }
        });

        await volunteer.save();

        res.status(200).json({
            message: 'Volunteer updated successfully',
            volunteer
        });
    } catch (error) {
       handleError(res, error);
    }
};

exports.applyToHelpRequest = async (req, res) => {
    try {
        const volunteerId = req.user.id;
        const helpRequestId = req.params.id;

        const helpRequest = await OrphanageHelpRequest.findByPk(helpRequestId);
        if (!helpRequest) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Help request not found' });

        const existingApplication = await VolunteerHelpRequest.findOne({ where: { volunteerId, helpRequestId } });
        if (existingApplication) return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'You already applied to this help request' });

        await VolunteerHelpRequest.create({ volunteerId, helpRequestId });

        return res.status(HTTP_STATUS.CREATED).json({ message: 'Application submitted successfully' });
    } catch {
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.getVolunteerApplications = async (req, res) => {
    try {
        const volunteerId = req.user.id;

        const applications = await OrphanageHelpRequest.findAll({
            include: [{
                model: Volunteer,
                where: { id: volunteerId },
                attributes: []
            }]
        });

        return res.json(applications);
    } catch {
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Server error' });
    }
};

exports.cancelApplication = async (req, res) => {
    try {
        const volunteerId = req.user.id;
        const applicationId = req.params.applicationId;

        const application = await VolunteerHelpRequest.findOne({
            where: { volunteerId, helpRequestId: applicationId }
        });

        if (!application) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Application not found' });

        await application.destroy();

        return res.json({ message: 'Application cancelled successfully' });
    } catch {
        return res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Server error' });
    }
};


exports.matchVolunteerToOpportunities = async (req, res) => {
    try {
        const volunteerId = req.params.id;
        const volunteer = await Volunteer.findByPk(volunteerId);

        if (!volunteer) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Volunteer not found' });
        }

        const matches = await OrphanageHelpRequest.findAll({
            where: {
                preferredLocation: volunteer.preferredLocation,
                requiredSkills: {
                    [Op.overlap]: volunteer.skills
                },
                availability: volunteer.availability
            }
        });

        res.status(HTTP_STATUS.OK).json({
            message: 'Matched opportunities fetched successfully',
            matches
        });

    } catch (error) {
        handleError(res, error);
    }
};
