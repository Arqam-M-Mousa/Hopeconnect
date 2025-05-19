const {Volunteer, OrphanageHelpRequest, VolunteerHelpRequest} = require('../models');
const {Op} = require('sequelize');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

/**
 * @module services/volunteer
 * @description Service functions for volunteer-related operations
 */

/**
 * Get the current authenticated volunteer's profile
 * @async
 * @function getCurrentVolunteerProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with volunteer profile details
 */
exports.getCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id, {
            attributes: {exclude: ['password']}
        });
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile fetched successfully', volunteer
        });

    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Update the current authenticated volunteer's profile
 * @async
 * @function updateCurrentVolunteerProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} req.body - Request body with fields to update
 * @param {Array<string>} [req.body.servicesOffered] - Updated services offered
 * @param {string} [req.body.availability] - Updated availability
 * @param {string} [req.body.preferredLocation] - Updated preferred location
 * @param {string} [req.body.skills] - Updated skills
 * @param {string} [req.body.experience] - Updated experience
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated volunteer profile details
 */
exports.updateCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id, {
            attributes: {exclude: ['password']}
        });
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});

        const updatableFields = ['servicesOffered', 'availability', 'preferredLocation', 'skills', 'experience'];

        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                volunteer[field] = req.body[field];
            }
        });

        await volunteer.save();

        res.status(HTTP_STATUS.OK).json({
            message: 'Profile updated successfully', volunteer
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete the current authenticated volunteer's profile
 * @async
 * @function deleteCurrentVolunteerProfile
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteCurrentVolunteerProfile = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.user.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});

        await volunteer.destroy();
        res.status(HTTP_STATUS.OK).json({message: 'Your account has been deleted'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get a volunteer by ID
 * @async
 * @function getVolunteerById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Volunteer ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with volunteer details
 */
exports.getVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});
        res.status(HTTP_STATUS.OK).json(volunteer);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete a volunteer by ID (admin function)
 * @async
 * @function deleteVolunteerById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Volunteer ID to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});

        await volunteer.destroy();
        res.status(HTTP_STATUS.OK).json({message: 'Volunteer deleted'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Verify a volunteer (admin function)
 * @async
 * @function verifyVolunteer
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Volunteer ID to verify
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with verification confirmation
 */
exports.verifyVolunteer = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id);
        if (!volunteer) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});

        volunteer.verified = true;
        await volunteer.save();
        res.status(HTTP_STATUS.OK).json({message: 'Volunteer verified'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get all volunteers with pagination
 * @async
 * @function getVolunteers
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated volunteers list
 */
exports.getVolunteers = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Volunteer.findAndCountAll({
            limit, offset, order: [['createdAt', 'DESC']]
        });

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Search for volunteers by skill and availability
 * @async
 * @function searchVolunteers
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {string} [req.query.skill] - Skill to search for
 * @param {string} [req.query.availability] - Availability to filter by
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with matching volunteers
 */
exports.searchVolunteers = async (req, res) => {
    try {
        const {skill, availability} = req.query;

        const volunteers = await Volunteer.findAll({
            where: {
                ...(availability && {availability}),
            }, include: [{
                model: Volunteer, where: skill ? {name: {[Op.like]: `%${skill}%`}} : {}, required: !!skill
            }]
        });

        res.status(HTTP_STATUS.OK).json(volunteers);
    } catch (error) {
        handleError(res, error);
    }
};
/**
 * Update a volunteer by ID (admin function)
 * @async
 * @function updateVolunteerById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Volunteer ID to update
 * @param {Object} req.body - Request body with fields to update
 * @param {Array<string>} [req.body.servicesOffered] - Updated services offered
 * @param {string} [req.body.availability] - Updated availability
 * @param {string} [req.body.preferredLocation] - Updated preferred location
 * @param {string} [req.body.skills] - Updated skills
 * @param {string} [req.body.experience] - Updated experience
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated volunteer details
 */
exports.updateVolunteerById = async (req, res) => {
    try {
        const volunteer = await Volunteer.findByPk(req.params.id, {
            attributes: {exclude: ['password']}
        });
        if (!volunteer) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});
        }

        const allowedFields = ['servicesOffered', 'availability', 'preferredLocation', 'skills', 'experience'];

        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                volunteer[field] = req.body[field];
            }
        });

        await volunteer.save();

        res.status(HTTP_STATUS.OK).json({
            message: 'Volunteer updated successfully', volunteer
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Apply to a help request as a volunteer
 * @async
 * @function applyToHelpRequest
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (volunteer)
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Help request ID to apply to
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with application confirmation
 */
exports.applyToHelpRequest = async (req, res) => {
    try {
        const volunteerId = req.user.id;
        const helpRequestId = req.params.id;

        const helpRequest = await OrphanageHelpRequest.findByPk(helpRequestId);
        if (!helpRequest) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Help request not found'});

        const existingApplication = await VolunteerHelpRequest.findOne({where: {volunteerId, helpRequestId}});
        if (existingApplication) return res.status(HTTP_STATUS.BAD_REQUEST).json({message: 'You already applied to this help request'});

        await VolunteerHelpRequest.create({volunteerId, helpRequestId});

        return res.status(HTTP_STATUS.CREATED).json({message: 'Application submitted successfully'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get applications made by the current volunteer
 * @async
 * @function getVolunteerApplications
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (volunteer)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with volunteer's applications
 */
exports.getVolunteerApplications = async (req, res) => {
    try {
        const volunteerId = req.user.id;

        const applications = await VolunteerHelpRequest.findAll({
            where: {volunteerId}, include: [OrphanageHelpRequest]
        })

        return res.status(HTTP_STATUS.OK).json(applications);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Cancel a volunteer application
 * @async
 * @function cancelApplication
 * @param {Object} req - Express request object
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (volunteer)
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.applicationId - Application ID to cancel
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with cancellation confirmation
 */
exports.cancelApplication = async (req, res) => {
    try {
        const volunteerId = req.user.id;
        const applicationId = req.params.applicationId;

        const application = await VolunteerHelpRequest.findOne({
            where: {volunteerId, helpRequestId: applicationId}
        });

        if (!application) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Application not found'});

        await application.destroy();

        return res.status(HTTP_STATUS.OK).json({message: 'Application cancelled successfully'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Match a volunteer to suitable help request opportunities
 * @async
 * @function matchVolunteerToOpportunities
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Volunteer ID to match
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with matching opportunities
 */
exports.matchVolunteerToOpportunities = async (req, res) => {
    try {
        const volunteerId = req.params.id;
        const volunteer = await Volunteer.findByPk(volunteerId);

        if (!volunteer) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Volunteer not found'});
        }

        const {preferredLocation, skills, availability} = volunteer;

        if (!preferredLocation || !Array.isArray(skills) || skills.length === 0 || !availability) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Volunteer profile is incomplete for matching (location, skills, or availability missing)'
            });
        }

        const matches = await OrphanageHelpRequest.findAll({
            where: {
                preferredLocation, requiredSkills: {
                    [Op.overlap]: skills
                }, availability
            }
        });

        res.status(HTTP_STATUS.OK).json({
            message: 'Matched opportunities fetched successfully', matches
        });

    } catch (error) {
        handleError(res, error);
    }
};
