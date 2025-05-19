const {Sponsorship , Orphan} = require('../models/index.js');
const {sequelize,DatabaseConnection} = require('../config/database');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');

exports.createSponsorship = async (req, res) => {
    try {
        if (!req.body.orphanId || !req.body.frequency) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Missing required fields'
            });
        }

        const result = await DatabaseConnection.executeTransaction(async (transaction) => {
            const orphan = await Orphan.findByPk(req.body.orphanId, {
                lock: true, transaction
            });
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
                default:
                    return res.status(HTTP_STATUS.BAD_REQUEST).json({message: 'Invalid frequency value'});

            }

            const sponsorship = await Sponsorship.create({
                ...req.body, sponsorId: req.user.id, startDate, nextPaymentDate, status: 'active'
            }, {transaction});

            await orphan.update({
                isAvailableForSponsorship: false, currentSponsorshipId: sponsorship.id
            }, {transaction});

            return {sponsorship, orphanName: orphan.name};
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: `Sponsorship created successfully for ${result.orphanName}`, sponsorship: result.sponsorship
        });

    } catch (error) {
        handleError(res, error);
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
        if (!req.body.sponsorshipId) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: 'Sponsorship ID is required'
            });
        }
        const result = await DatabaseConnection.executeTransaction(async (transaction) => {
            const sponsorship = await Sponsorship.findOne({
                where: {
                    id: req.body.sponsorshipId, sponsorId: req.user.id
                }, include: [{
                    model: Orphan, attributes: ['id', 'name']
                }], lock: true, transaction
            });

            if (!sponsorship) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Sponsorship not found or not authorized'});
            }

            if (req.body.status === 'ended') {
                req.body.endDate = (!req.body.endDate) ? new Date() : req.body.endDate;
                await sponsorship.Orphan.update({
                    isAvailableForSponsorship: true, currentSponsorshipId: null
                }, {transaction});

            }
            await sponsorship.update(req.body, {transaction});

            return sponsorship;
        });

        res.status(HTTP_STATUS.OK).json({
            message: 'Sponsorship updated successfully', sponsorship: result
        });
    } catch (error) {
        handleError(res, error);
    }
};
exports.deleteSponsorship = async (req, res) => {
    try {
        const sponsorship = await Sponsorship.findByPk(req.params.id);

        if (!sponsorship) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: 'Sponsorship not found'});
        }

        if (sponsorship.sponsorId !== req.user.id) {
            return res.status(HTTP_STATUS.FORBIDDEN).json({message: 'Forbidden: not your sponsorship'});
        }

        await sponsorship.destroy();
        res.json({message: 'Sponsorship deleted'});
    } catch (error) {
        res.status(HTTP_STATUS.SERVER_ERROR).json({message: 'Server error', error});
    }
};
exports.getSponsorships = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Sponsorship.findAndCountAll({
            where: {status: 'active'}, limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "sponsorships not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};
