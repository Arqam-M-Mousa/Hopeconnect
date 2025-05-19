const { Review } = require("../models/index.js");
const {
  formatPaginatedResponse,
  getPaginationParams,
} = require("../utils/pagination");
const { HTTP_STATUS, handleError } = require("../utils/responses");

/**
 * @module services/review
 * @description Service functions for review-related operations
 */

/**
 * Create a new review
 * @async
 * @function postReview
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing review data
 * @param {number} req.body.orphanageId - ID of the orphanage being reviewed
 * @param {number} req.body.rating - Rating given to the orphanage (1-5)
 * @param {string} req.body.comment - Text content of the review
 * @param {Object} req.user - Authenticated user information
 * @param {number} req.user.id - ID of the authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created review details
 */
exports.postReview = async (req, res) => {
  try {
    const reviewData = {
      ...req.body,
      userId: req.user.id,
    };
    const newReview = await Review.create(reviewData);
    res.status(HTTP_STATUS.CREATED).json({
      message: "Review created successfully",
      review: newReview,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Delete a review
 * @async
 * @function deleteReview
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body
 * @param {number} req.body.id - ID of the review to delete
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.body.id);
    if (!review) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Review not found" });
    }
    await review.destroy();
    res.status(HTTP_STATUS.OK).json({
      message: "Review deleted successfully",
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Update a review
 * @async
 * @function updateReview
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body with fields to update
 * @param {number} req.body.id - ID of the review to update
 * @param {number} [req.body.rating] - Updated rating
 * @param {string} [req.body.comment] - Updated comment
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated review details
 */
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.body.id);
    if (!review) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Review not found" });
    }
    await review.update(req.body);
    res.status(HTTP_STATUS.OK).json({
      message: "Review updated successfully",
      review,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get all reviews with pagination
 * @async
 * @function getReviews
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated reviews list
 */
exports.getReviews = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const result = await Review.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    if (!result.rows.length) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Reviews not found" });
    }

    res
      .status(HTTP_STATUS.OK)
      .json(formatPaginatedResponse(result, page, limit));
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get a review by ID
 * @async
 * @function getReviewById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Review ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with review details
 */
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);

    if (!review) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Review not found" });
    }

    res.status(HTTP_STATUS.OK).json(review);
  } catch (error) {
    handleError(res, error);
  }
};
