const {Sponsorship} = require('../models/index.js');
const sequelize = require('../config/database');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');

exports.createSponsorship = async (req, res) => {
    try {
        const orphan = await Orphan.findByPk(req.body.orphanId);
        if (!orphan) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Orphan not found'});
        }

        if (!orphan.isAvailableForSponsorship) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: 'This orphan is not available for sponsorship'});
        }

        const startDate = new Date();
        let nextPaymentDate = new Date(startDate);

        switch (req.body.frequency) {
            case 'monthly':
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
                break;
            case 'quarterly':
                nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
                break;
            case 'yearly':
                nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
                break;
            case 'one-time':
                nextPaymentDate = null;
                break;
        }

        const sponsorship = await Sponsorship.create(req.body);

        //Todo create the donation


        await SponsorshipUpdate.create({
            sponsorshipId: sponsorship.id,
            updateType: 'status_change',
            title: 'Sponsorship Started',
            content: `You have successfully started sponsoring ${orphan.name}. Thank you for your generosity!`,
            createdBy: req.userId
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: 'Sponsorship created successfully', sponsorship
        });
    } catch (error) {
        handleError(error);
    }
};

exports.getSponsorshipById = async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.id);

        if (!sponsorship) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Sponsorship not found"});
        }

        res.status(HTTP_STATUS.OK).json(sponsorship);
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateSponsorship = async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findOne({
            where: {
                id: req.body.sponsorshipId, sponsorId: req.userId
            }, include: [{model: Orphan, attributes: ['name']}]
        });

        if (!sponsorship) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Sponsorship not found or not authorized'});
        }

        await sponsorship.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: 'Sponsorship updated successfully', sponsorship
        });
    } catch (error) {
        handleError(error);
    }
};

exports.getSponsorships = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Sponsorship.findAndCountAll({
            where: {isAvailableForSponsorship: true}, limit, offset, order: [["createdAt", "DESC"]]
        });

        res.status(HTTP_STATUS.OK).json({
            result, totalPages: Math.ceil(result.count / limit), currentPage: page, totalOrphans: result.count
        });
        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "sponsorships not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

