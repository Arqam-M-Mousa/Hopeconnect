const { Sponsorship, Orphan } = require("../models/index.js");
const { sequelize, DatabaseConnection } = require("../config/database");
const {
  formatPaginatedResponse,
  getPaginationParams,
} = require("../utils/pagination");
const { HTTP_STATUS, handleError } = require("../utils/responses");

/**
 * @module services/sponsorship
 * @description Service functions for sponsorship-related operations
 */

/**
 * Create a new sponsorship
 * @async
 * @function createSponsorship
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing sponsorship data
 * @param {number} req.body.orphanId - ID of the orphan to sponsor
 * @param {string} req.body.frequency - Frequency of sponsorship (monthly, quarterly, yearly, one-time)
 * @param {number} req.body.amount - Amount to contribute per frequency
 * @param {string} [req.body.notes] - Additional notes about the sponsorship
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (sponsor)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created sponsorship details
 */
exports.createSponsorship = async (req, res) => {
  try {
    if (!req.body.orphanId || !req.body.frequency) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Missing required fields",
      });
    }

    const result = await DatabaseConnection.executeTransaction(
      async (transaction) => {
        const orphan = await Orphan.findByPk(req.body.orphanId, {
          lock: true,
          transaction,
        });
        if (!orphan) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Orphan not found" });
        }

        if (!orphan.isAvailableForSponsorship) {
          return res
            .status(HTTP_STATUS.BAD_REQUEST)
            .json({ message: "This orphan is not available for sponsorship" });
        }

        const startDate = new Date();
        let nextPaymentDate = new Date(startDate);

        switch (req.body.frequency) {
          case "monthly":
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
            break;
          case "quarterly":
            nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
            break;
          case "yearly":
            nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
            break;
          case "one-time":
            nextPaymentDate = null;
            break;
          default:
            return res
              .status(HTTP_STATUS.BAD_REQUEST)
              .json({ message: "Invalid frequency value" });
        }

        const sponsorship = await Sponsorship.create(
          {
            ...req.body,
            sponsorId: req.user.id,
            startDate,
            nextPaymentDate,
            status: "active",
          },
          { transaction }
        );

        await orphan.update(
          {
            isAvailableForSponsorship: false,
            currentSponsorshipId: sponsorship.id,
          },
          { transaction }
        );

        return { sponsorship, orphanName: orphan.name };
      }
    );

    res.status(HTTP_STATUS.CREATED).json({
      message: `Sponsorship created successfully for ${result.orphanName}`,
      sponsorship: result.sponsorship,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get a sponsorship by ID
 * @async
 * @function getSponsorshipById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Sponsorship ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with sponsorship details
 */
exports.getSponsorshipById = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findByPk(req.params.id);

    if (!sponsorship) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Sponsorship not found" });
    }

    res.status(HTTP_STATUS.OK).json(sponsorship);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Update a sponsorship
 * @async
 * @function updateSponsorship
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body with fields to update
 * @param {number} req.body.sponsorshipId - ID of the sponsorship to update
 * @param {string} [req.body.status] - Updated status of the sponsorship (active, paused, ended)
 * @param {number} [req.body.amount] - Updated amount to contribute
 * @param {string} [req.body.frequency] - Updated frequency of sponsorship
 * @param {Date} [req.body.endDate] - End date of the sponsorship
 * @param {string} [req.body.notes] - Updated notes about the sponsorship
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (sponsor)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated sponsorship details
 */
exports.updateSponsorship = async (req, res) => {
  try {
    if (!req.body.sponsorshipId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Sponsorship ID is required",
      });
    }
    const result = await DatabaseConnection.executeTransaction(
      async (transaction) => {
        const sponsorship = await Sponsorship.findOne({
          where: {
            id: req.body.sponsorshipId,
            sponsorId: req.user.id,
          },
          include: [
            {
              model: Orphan,
              attributes: ["id", "name"],
            },
          ],
          lock: true,
          transaction,
        });

        if (!sponsorship) {
          return res
            .status(HTTP_STATUS.NOT_FOUND)
            .json({ message: "Sponsorship not found or not authorized" });
        }

        if (req.body.status === "ended") {
          req.body.endDate = !req.body.endDate ? new Date() : req.body.endDate;
          await sponsorship.Orphan.update(
            {
              isAvailableForSponsorship: true,
              currentSponsorshipId: null,
            },
            { transaction }
          );
        }
        await sponsorship.update(req.body, { transaction });

        return sponsorship;
      }
    );

    res.status(HTTP_STATUS.OK).json({
      message: "Sponsorship updated successfully",
      sponsorship: result,
    });
  } catch (error) {
    handleError(res, error);
  }
};
/**
 * Delete a sponsorship
 * @async
 * @function deleteSponsorship
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Sponsorship ID
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user (sponsor)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteSponsorship = async (req, res) => {
  try {
    const sponsorship = await Sponsorship.findByPk(req.params.id);

    if (!sponsorship) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Sponsorship not found" });
    }

    if (sponsorship.sponsorId !== req.user.id) {
      return res
        .status(HTTP_STATUS.FORBIDDEN)
        .json({ message: "Forbidden: not your sponsorship" });
    }

    await sponsorship.destroy();
    res.json({ message: "Sponsorship deleted" });
  } catch (error) {
    res
      .status(HTTP_STATUS.SERVER_ERROR)
      .json({ message: "Server error", error });
  }
};
/**
 * Get all active sponsorships with pagination
 * @async
 * @function getSponsorships
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated active sponsorships list
 */
exports.getSponsorships = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const result = await Sponsorship.findAndCountAll({
      where: { status: "active" },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (!result.rows.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "sponsorships not found" });
    }

    res
      .status(HTTP_STATUS.OK)
      .json(formatPaginatedResponse(result, page, limit));
  } catch (error) {
    handleError(res, error);
  }
};
