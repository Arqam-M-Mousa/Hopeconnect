const {Partner, Orphanage} = require('../models');
const {getPaginationParams, formatPaginatedResponse} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require("../utils/responses");
const Delivery = require("../models/deliveryTracking");

/**
 * @module services/partnership
 * @description Service functions for partnership-related operations
 */

/**
 * Create a new partner
 * @async
 * @function createPartner
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing partner data
 * @param {string} req.body.name - Name of the partner organization
 * @param {string} req.body.type - Type of organization
 * @param {string} req.body.contactEmail - Email address for the partner
 * @param {string} req.body.phone - Phone number for the partner
 * @param {string} req.body.address - Physical address of the partner
 * @param {string} req.body.description - Description of the partner organization
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created partner details
 */
exports.createPartner = async (req, res) => {
    try {
        const partner = await Partner.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({message: 'Partner created successfully', partner});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get a partner by ID
 * @async
 * @function getPartnerById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Partner ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with partner details
 */
exports.getPartnerById = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
        if (!partner) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});
        }
        res.status(HTTP_STATUS.OK).json(partner);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Update a partner by ID
 * @async
 * @function updatePartner
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Partner ID
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.name] - Updated name of the partner organization
 * @param {string} [req.body.type] - Updated type of organization
 * @param {string} [req.body.contactEmail] - Updated email address for the partner
 * @param {string} [req.body.phone] - Updated phone number for the partner
 * @param {string} [req.body.address] - Updated physical address of the partner
 * @param {string} [req.body.description] - Updated description of the partner organization
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated partner details
 */
exports.updatePartner = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
        if (!partner) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});

        await partner.update(req.body);

        res.status(HTTP_STATUS.OK).json({message: 'Partner updated', partner});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Delete a partner by ID
 * @async
 * @function deletePartner
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Partner ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deletePartner = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
        if (!partner) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});

        await partner.destroy();
        res.status(HTTP_STATUS.OK).json({message: 'Partner deleted'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get all partners with pagination
 * @async
 * @function getAllPartners
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated partners list
 */
exports.getAllPartners = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const deliveries = await Partner.findAndCountAll({
            limit, offset, order: [['createdAt', 'DESC']]
        });
        const response = formatPaginatedResponse(deliveries, page, limit);
        res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Get all orphanages associated with a partner
 * @async
 * @function getOrphanagesForPartner
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.partnershipId - Partner ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with orphanages associated with the partner
 */
exports.getOrphanagesForPartner = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.partnershipId);
        if (!partner) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});

        const orphanages = await partner.getOrphanages();
        res.status(HTTP_STATUS.OK).json(orphanages);

    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Link a partner to an orphanage
 * @async
 * @function linkPartnerToOrphanage
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.partnershipId - Partner ID
 * @param {string} req.params.orphanageId - Orphanage ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with confirmation of the link
 */
exports.linkPartnerToOrphanage = async (req, res) => {
    try {
        const {partnershipId , orphanageId} = req.params;
        const partner = await Partner.findByPk(partnershipId );
        if (!partner) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Orphanage not found'});

        await partner.addOrphanage(orphanage);
        res.status(HTTP_STATUS.OK).json({message: 'Partner linked to orphanage successfully'});
    } catch (error) {
        handleError(res, error);
    }
};

/**
 * Unlink a partner from an orphanage
 * @async
 * @function unlinkPartnerFromOrphanage
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.partnershipId - Partner ID
 * @param {string} req.params.orphanageId - Orphanage ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with confirmation of the unlink
 */
exports.unlinkPartnerFromOrphanage = async (req, res) => {
    try {
        const {partnershipId , orphanageId} = req.params;
        const partner = await Partner.findByPk(partnershipId );
        if (!partner) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Partner not found'});

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Orphanage not found'});

        await partner.removeOrphanage(orphanage);
        res.status(HTTP_STATUS.OK).json({message: 'Partner unlinked from orphanage successfully'});
    } catch (error) {
        handleError(res, error);
    }
};
