const { Orphan } = require("../models/index.js");
const {
  formatPaginatedResponse,
  getPaginationParams,
} = require("../utils/pagination");
const { HTTP_STATUS, handleError } = require("../utils/responses");

/**
 * @module services/orphan
 * @description Service functions for orphan-related operations
 */

/**
 * Create a new orphan
 * @async
 * @function createOrphan
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing orphan data
 * @param {string} req.body.name - Orphan's name
 * @param {number} req.body.age - Orphan's age
 * @param {string} req.body.gender - Orphan's gender ('male' or 'female')
 * @param {string} [req.body.educationStatus] - Orphan's education status
 * @param {string} [req.body.healthCondition] - Orphan's health condition
 * @param {string} [req.body.background] - Orphan's background information
 * @param {number} req.body.orphanageId - ID of the orphanage
 * @param {string} [req.body.profileImage] - URL or path to orphan's profile image
 * @param {boolean} [req.body.isAvailableForSponsorship=true] - Whether orphan is available for sponsorship
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created orphan
 */
exports.createOrphan = async (req, res) => {
  try {
    const newOrphan = await Orphan.create(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Orphan created successfully",
      orphanage: newOrphan,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get orphans available for sponsorship
 * @async
 * @function getOrphansAvailableForSponsorship
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated orphans available for sponsorship
 */
exports.getOrphansAvailableForSponsorship = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const result = await Orphan.findAndCountAll({
      where: { isAvailableForSponsorship: true },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (!result.rows.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Orphan not found" });
    }

    res
      .status(HTTP_STATUS.OK)
      .json(formatPaginatedResponse(result, page, limit));
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get an orphan by ID
 * @async
 * @function getOrphanById
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Orphan ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with orphan details
 */
exports.getOrphanById = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);

    if (!orphan) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Orphanage not found" });
    }

    res.status(HTTP_STATUS.OK).json(orphan);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Delete an orphan by ID
 * @async
 * @function deleteOrphan
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Orphan ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);

    if (!orphan) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Orphan not found" });
    }

    await orphan.destroy();
    res.status(HTTP_STATUS.OK).json({
      message: "Orphan deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Update an orphan by ID
 * @async
 * @function updateOrphan
 * @param {Object} req - Express request object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Orphan ID
 * @param {Object} req.body - Request body with fields to update
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated orphan
 */
exports.updateOrphan = async (req, res) => {
  try {
    const orphan = await Orphan.findByPk(req.params.id);

    if (!orphan) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Orphan not found" });
    }

    await orphan.update(req.body);
    res.status(HTTP_STATUS.OK).json({
      message: "Orphan updated successfully",
      orphan,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get all orphans with pagination
 * @async
 * @function getOrphans
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated orphans list
 */
exports.getOrphans = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const result = await Orphan.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (!result.rows.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Orphan not found" });
    }

    res
      .status(HTTP_STATUS.OK)
      .json(formatPaginatedResponse(result, page, limit));
  } catch (error) {
    handleError(res, error);
  }
};
