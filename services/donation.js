const {Donation, DonationsTracking} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');


exports.getDonationByID = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);

        if (!donation) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donation not found"});
        }

        res.status(HTTP_STATUS.OK).json(donation);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getDonations = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Donation.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });
        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donations not found"});
        }
        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.donate = async (req, res) => {
    try {
        const newDonation = await Donation.create(req.body);

        await DonationTracking.create({
            donationId: newDonation.id,
            status: newDonation.status,
            title: 'Donation Created',
            description: 'The donation has been received and is pending processing.',
            imageUrl: null,
            isRead: false,
            createdBy: req.body.createdBy || req.user.id
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Donation created successfully", Donation: newDonation
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);

        if (!donation) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donation not found"});
        }

        await donation.update(req.body);

        await DonationTracking.create({
            donationId: donation.id,
            status: req.body.status,
            title: req.body.title || 'Status Updated',
            description: req.body.description || 'Donation status was updated.',
            imageUrl: req.body.imageUrl || null,
            isRead: false,
            createdBy: req.body.userId || req.user.id,
        });

        res.status(HTTP_STATUS.OK).json({
            message: "Donation updated successfully", donation
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);

        if (!donation) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donation not found"});
        }
        await donation.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Donation deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAllUpdates = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await DonationsTracking.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });
        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Updates not found"});
        }
        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getUserDonationsUpdates = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await DonationsTracking.findAndCountAll({
            where: {userId: req.user.id}, limit, offset, order: [["createdAt", "DESC"]]
        });
        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Updates for user not found"});
        }
        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getUserUpdateById = async (req, res) => {
    try {
        const updateId = req.params.id;
        const donation = await DonationsTracking.findOne({
            where: {userId: req.user.id}, updateId
        });

        if (!donation) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donation not found"});
        }

        res.status(HTTP_STATUS.OK).json(donation);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getUpdateById = async (req, res) => {
    try {
        const donation = await DonationsTracking.findByPk(req.params.id);

        if (!donation) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Update not found"});
        }

        res.status(HTTP_STATUS.OK).json(donation);
    } catch (error) {
        handleError(res, error);
    }
};