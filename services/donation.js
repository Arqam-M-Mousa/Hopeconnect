const {Donation, DonationsTracking, User, Campaign} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');
const nodemailer = require('nodemailer')
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD
    }
});

const sendEmergencyEmail = async (email, amount, campaignTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: `Emergency Donation Received - ${campaignTitle}`,
        text: `Thank you for your donation of $${amount} towards "${campaignTitle}". Your help is urgently needed and appreciated!`
    };

    await transporter.sendMail(mailOptions);
};
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
        const amount = parseFloat(req.body.amount);
        const feeRate = parseFloat(req.body.transactionFee) || 0;

        if (isNaN(amount) || amount <= 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid amount"});
        }
        if (isNaN(feeRate) || feeRate < 0 || feeRate > 1) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid transaction fee rate"});
        }
        const transactionFee = parseFloat((amount * feeRate).toFixed(2));
        const netAmount = parseFloat((amount - transactionFee).toFixed(2));

        const newDonation = await Donation.create({
            ...req.body, transactionFee, netAmount
        });
        let campaign = null;
        if (req.body.campaignId) {
            campaign = await Campaign.findByPk(req.body.campaignId);
            if (!campaign) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid campaign ID"});
            }
        }

        await DonationsTracking.create({
            donationId: newDonation.id,
            status: newDonation.status,
            title: 'Donation Created',
            description: 'The donation has been received and is pending processing.',
            imageUrl: null,
            isRead: false,
            createdBy: req.body.createdBy || req.user.id
        });

        if (campaign?.isEmergency) {
            const donor = await User.findByPk(req.body.donorId);
            if (donor?.email) {
                await sendEmergencyEmail(donor.email, newDonation, campaign?.title);
            }
        }
        res.status(HTTP_STATUS.CREATED).json({
            message: "Donation created successfully", donation: newDonation
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

        await DonationsTracking.create({
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
        const donationId = req.params.id;

        const result = await DonationsTracking.findAndCountAll({
            where: {donationId}, limit, offset, order: [["createdAt", "DESC"]]
        });
        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Updates for donation not found"});
        }
        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getUserUpdateById = async (req, res) => {
    try {
        const donationId = req.params.id;
        const updateId = req.params.updateId;

        const update = await DonationsTracking.findOne({
            where: { donationId, id: updateId }
        });

        if (!update) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Update not found"});
        }

        res.status(HTTP_STATUS.OK).json(update);
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
