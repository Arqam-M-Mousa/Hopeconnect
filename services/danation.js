const {Donation} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');


exports.getDonationByID = async (req, res) => {
    try {
        const donation = await Donation.findByPk(req.params.id);

        if (!Donation) {
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
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Donation not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.donate = async (req, res) => {
    try {
        const newDonation = await Donation.create(req.body);

        //Todo add real payment method

        res.status(HTTP_STATUS.CREATED).json({
            message: "newDonation deployed successfully", orphanage: newDonation
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

        await Donation.update(req.body);
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
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "donation not found"});
        }
        await donation.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "donation deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};

