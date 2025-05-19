const {Partner, Orphanage} = require('../models');
const {getPaginationParams, formatPaginatedResponse} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require("../utils/responses");
const Delivery = require("../models/deliveryTracking");

exports.createPartner = async (req, res) => {
    try {
        const partner = await Partner.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({message: 'Partner created successfully', partner});
    } catch (error) {
        handleError(res, error);
    }
};

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
