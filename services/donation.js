const {Donation, DonationsTracking, User, Campaign} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');
const nodemailer = require('nodemailer')
require('dotenv').config();

/**
 * @module services/donation
 * @description Service functions for donation-related operations
 */

/**
 * Nodemailer transporter for sending emails
 * @type {nodemailer.Transporter}
 * @private
 */
const transporter = nodemailer.createTransport({
    service: 'gmail', auth: {
        user: process.env.EMAIL_ADDRESS, pass: process.env.EMAIL_PASSWORD
    }
});

/**
 * Send an email notification for emergency donations
 * @async
 * @function sendEmergencyEmail
 * @param {string} email - Recipient email address
 * @param {number} amount - Donation amount
 * @param {string} campaignTitle - Title of the emergency campaign
 * @returns {Promise<void>}
 * @private
 */
const sendEmergencyEmail = async (email, amount, campaignTitle) => {
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: `Emergency Donation Received - ${campaignTitle}`,
        text: `Thank you for your donation of $${amount} towards "${campaignTitle}". Your help is urgently needed and appreciated!`
    };

  await transporter.sendMail(mailOptions);
};
/**
 * Get a donation by ID
 * @async
 * @function getDonationByID
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Donation ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with donation details
 */
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

/**
 * Get all donations with pagination
 * @async
 * @function getDonations
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated donations list
 */
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

/**
 * Create a new donation
 * @async
 * @function donate
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing donation data
 * @param {number} req.body.amount - Donation amount
 * @param {number} [req.body.transactionFee] - Transaction fee rate (0-1)
 * @param {string} req.body.category - Donation category
 * @param {string} req.body.donationType - Type of donation
 * @param {number} req.body.orphanageId - ID of the orphanage receiving the donation
 * @param {number} [req.body.campaignId] - ID of the campaign (if applicable)
 * @param {string} [req.body.status='pending'] - Status of the donation
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created donation details
 */
exports.donate = async (req, res) => {
    try {
        const amount = parseFloat(req.body.amount);
        const feeRate = parseFloat(req.body.transactionFee) || 0;
        const user = req.user;

        if (isNaN(amount) || amount <= 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid amount"});
        }
        if (isNaN(feeRate) || feeRate < 0 || feeRate > 1) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid transaction fee rate"});
        }
        const transactionFee = parseFloat((amount * feeRate).toFixed(2));
        const netAmount = parseFloat((amount - transactionFee).toFixed(2));

        let campaign = null;
        if (req.body.campaignId) {
            campaign = await Campaign.findByPk(req.body.campaignId);
            if (!campaign) {
                return res.status(HTTP_STATUS.BAD_REQUEST).json({message: "Invalid campaign ID"});
            }
        }

        const newDonation = await Donation.create({
            ...req.body,
            donorId: user.id,
            createdBy: user.id,
            transactionFee,
            netAmount,
            status: req.body.status || 'pending'
        });

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

/**
 * Update a donation and create a tracking record
 * @async
 * @function updateDonation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Donation ID
 * @param {Object} req.body - Request body with fields to update
 * @param {string} [req.body.status] - Updated status of the donation
 * @param {string} [req.body.title] - Title for the tracking update
 * @param {string} [req.body.description] - Description for the tracking update
 * @param {string} [req.body.imageUrl] - Image URL for the tracking update
 * @param {number} [req.body.userId] - User ID creating the update
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated donation details
 */
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

/**
 * Delete a donation
 * @async
 * @function deleteDonation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Donation ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
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

/**
 * Get all donation tracking updates with pagination
 * @async
 * @function getAllUpdates
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated donation updates
 */
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

/**
 * Get updates for a specific donation with pagination
 * @async
 * @function getUserDonationsUpdates
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Donation ID
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated updates for a specific donation
 */
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

/**
 * Get a specific update for a donation
 * @async
 * @function getUserUpdateById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Donation ID
 * @param {string} req.params.updateId - Update ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with specific donation update
 */
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

/**
 * Get a donation update by ID
 * @async
 * @function getUpdateById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Update ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with donation update details
 */
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
