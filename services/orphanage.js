const {Orphanage, Orphan, OrphanageHelpRequest} = require('../models/index.js');
const sequelize = require('../config/database');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');

/**
 * @module services/orphanage
 * @description Service functions for orphanage-related operations
 */

/**
 * SQL query to get orphanage statistics
 * @constant {string}
 * @private
 */
const ORPHANAGE_STATISTICS_QUERY = `
    SELECT o.id,
           o.name,
           o.isVerified,
           COUNT(DISTINCT orph.id) as orphanCount,
           COUNT(DISTINCT hr.id)   as helpRequestCount,
           MAX(o.updatedAt)        as lastUpdated
    FROM Orphanages o
             LEFT JOIN Orphans orph ON o.id = orph.orphanageId
             LEFT JOIN OrphanageHelpRequests hr ON o.id = hr.orphanageId
    GROUP BY o.id, o.name, o.isVerified
    ORDER BY o.name ASC
`;

const calculateOrphanageStatistics = (totalOrphanages, totalOrphans, orphanageStats) => ({
    summary: {
        totalOrphanages,
        totalOrphans,
        averageOrphansPerOrphanage: totalOrphanages ? (totalOrphans / totalOrphanages).toFixed(2) : 0,
        verifiedOrphanages: orphanageStats.filter(o => o.isVerified).length
    }, orphanages: orphanageStats.map(formatOrphanageStats)
});

/**
 * Format orphanage statistics for API response
 * @function formatOrphanageStats
 * @param {Object} orphanage - Raw orphanage statistics object
 * @returns {Object} Formatted orphanage statistics
 * @private
 */
const formatOrphanageStats = (orphanage) => ({
    id: orphanage.id,
    name: orphanage.name,
    orphanCount: orphanage.orphanCount,
    helpRequestCount: orphanage.helpRequestCount,
    isVerified: orphanage.isVerified,
    lastUpdated: orphanage.lastUpdated
});

/**
 * Get all orphanages with pagination
 * @async
 * @function getOrphanages
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated orphanages list
 */
exports.getOrphanages = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Orphanage.findAndCountAll({
            limit, offset, order: [["rating", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanages not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get an orphanage by ID
 * @async
 * @function getOrphanageById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Orphanage ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with orphanage details
 */
exports.getOrphanageById = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        res.status(HTTP_STATUS.OK).json(orphanage);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Create a new orphanage
 * @async
 * @function createOrphanage
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing orphanage data
 * @param {string} req.body.name - Name of the orphanage
 * @param {string} req.body.address - Address of the orphanage
 * @param {string} req.body.contactPerson - Contact person name
 * @param {string} req.body.phone - Contact phone number
 * @param {string} req.body.email - Contact email address
 * @param {string} req.body.description - Description of the orphanage
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created orphanage details
 */
exports.createOrphanage = async (req, res) => {
    try {
        const newOrphanage = await Orphanage.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Orphanage created successfully", orphanage: newOrphanage
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Update an orphanage by ID
 * @async
 * @function updateOrphanage
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Orphanage ID
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Updated name of the orphanage
 * @param {string} [req.body.address] - Updated address of the orphanage
 * @param {string} [req.body.contactPerson] - Updated contact person name
 * @param {string} [req.body.phone] - Updated contact phone number
 * @param {string} [req.body.email] - Updated contact email address
 * @param {string} [req.body.description] - Updated description of the orphanage
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated orphanage details
 */
exports.updateOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        await orphanage.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Orphanage updated successfully", orphanage
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete an orphanage by ID
 * @async
 * @function deleteOrphanage
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Orphanage ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation or error if orphanage has associated orphans
 */
exports.deleteOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        const orphanCount = await Orphan.count({
            where: {orphanageId: req.params.id}
        });

        if (orphanCount > 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Cannot delete orphanage with associated orphans", orphanCount
            });
        }

        await orphanage.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Orphanage deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get orphanage statistics
 * @async
 * @function getStatistics
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with orphanage statistics including summary and detailed stats
 */
exports.getStatistics = async (req, res) => {
    try {
        const [totalOrphanages, totalOrphans, orphanageStats] = await Promise.all([Orphanage.count(), Orphan.count(), sequelize.query(ORPHANAGE_STATISTICS_QUERY, {
            type: sequelize.QueryTypes.SELECT, raw: true
        })]);

        const statistics = calculateOrphanageStatistics(totalOrphanages, totalOrphans, orphanageStats);
        res.status(HTTP_STATUS.OK).json({status: 'success', data: statistics});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get all help requests with pagination
 * @async
 * @function getHelpRequests
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated help requests
 */
exports.getHelpRequests = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await OrphanageHelpRequest.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get help requests for a specific orphanage with pagination
 * @async
 * @function getOrphanageHelpRequests
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Orphanage ID
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated help requests for the specified orphanage
 */
exports.getOrphanageHelpRequests = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const orphanageId = req.params.id;

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        const result = await OrphanageHelpRequest.findAndCountAll({
            where: {orphanageId}, limit, offset, order: [["createdAt", "DESC"]]
        });

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get a help request by ID
 * @async
 * @function getHelpRequestById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Help request ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with help request details
 */
exports.getHelpRequestById = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Help request not found"});
        }
        res.status(HTTP_STATUS.OK).json(helpRequest);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Create a new help request for an orphanage
 * @async
 * @function createHelpRequest
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Orphanage ID
 * @param {Object} req.body - Request body containing help request data
 * @param {string} req.body.title - Title of the help request
 * @param {string} req.body.description - Description of the help request
 * @param {string} req.body.requestType - Type of help requested
 * @param {string} req.body.urgencyLevel - Level of urgency
 * @param {string} [req.body.requiredSkills] - Skills required for the help
 * @param {Date} req.body.startDate - When the help is needed from
 * @param {Date} req.body.endDate - When the help is needed until
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created help request details
 */
exports.createHelpRequest = async (req, res) => {
    try {
        const {title, description, requestType, urgencyLevel, requiredSkills, startDate, endDate} = req.body;
        const orphanageId = req.params.id;

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        const helpRequest = await OrphanageHelpRequest.create({
            title, description, requestType, urgencyLevel, requiredSkills, startDate, endDate, orphanageId
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Help request created successfully", helpRequest
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Update a help request by ID
 * @async
 * @function updateHelpRequest
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Help request ID
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.title] - Updated title of the help request
 * @param {string} [req.body.description] - Updated description of the help request
 * @param {string} [req.body.requestType] - Updated type of help requested
 * @param {string} [req.body.urgencyLevel] - Updated level of urgency
 * @param {string} [req.body.requiredSkills] - Updated skills required for the help
 * @param {Date} [req.body.startDate] - Updated start date
 * @param {Date} [req.body.endDate] - Updated end date
 * @param {string} [req.body.status] - Updated status of the help request
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated help request details
 */
exports.updateHelpRequest = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Help request not found"});
        }

        await helpRequest.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Help request updated successfully", helpRequest
        });
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete a help request by ID
 * @async
 * @function deleteHelpRequest
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Help request ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteHelpRequest = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Help request not found"});
        }

        await helpRequest.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Help request deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};
