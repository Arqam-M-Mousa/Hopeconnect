const Delivery = require("../models/deliveryTracking");
const {
  getPaginationParams,
  formatPaginatedResponse,
} = require("../utils/pagination");
const { HTTP_STATUS, handleError } = require("../utils/responses");

/**
 * @module services/deliveryTracking
 * @description Service functions for delivery tracking operations
 */

/**
 * Get a delivery tracking record by ID
 * @async
 * @function getById
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Delivery tracking ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with delivery tracking details
 */
exports.getById = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Delivery not found" });
    res.status(HTTP_STATUS.OK).json(delivery);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Update a delivery tracking record
 * @async
 * @function updateDelivery
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Delivery tracking ID
 * @param {Object} req.body - Request body with fields to update
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with updated delivery tracking details
 */
exports.updateDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);

    if (!delivery)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Delivery not found" });

    await delivery.update(req.body);
    res.status(HTTP_STATUS.OK).json({
      message: "Delivery updated successfully",
      delivery: delivery,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Delete a delivery tracking record
 * @async
 * @function deleteDelivery
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Delivery tracking ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with deletion confirmation
 */
exports.deleteDelivery = async (req, res) => {
  try {
    const delivery = await Delivery.findByPk(req.params.id);
    if (!delivery)
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Delivery not found" });
    await delivery.destroy();
    res
      .status(HTTP_STATUS.OK)
      .json({ message: "Delivery deleted successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get the current location of a delivery
 * @async
 * @function getCurrentLocation
 * @param {Object} req - Express request object
 * @param {Object} req.params - Request parameters
 * @param {string} req.params.id - Delivery tracking ID
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with current location details
 */
exports.getCurrentLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await Delivery.findByPk(id, {
      attributes: ["id", "currentLocation"],
    });

    if (!delivery) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ error: "Delivery not found" });
    }

    res.json({ currentLocation: delivery.currentLocation });
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Get all delivery tracking records with pagination
 * @async
 * @function getAllDeliveries
 * @param {Object} req - Express request object
 * @param {Object} req.query - Query parameters
 * @param {number} [req.query.page=1] - Page number for pagination
 * @param {number} [req.query.limit=10] - Number of items per page
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with paginated delivery tracking records
 */
exports.getAllDeliveries = async (req, res) => {
  try {
    const { page, limit, offset } = getPaginationParams(req.query);
    const deliveries = await Delivery.findAndCountAll({
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
    const response = formatPaginatedResponse(deliveries, page, limit);
    res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    handleError(res, error);
  }
};

/**
 * Create a new delivery tracking record
 * @async
 * @function createDelivery
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing delivery data
 * @param {number} req.body.donationId - ID of the donation being delivered
 * @param {string} req.body.status - Status of the delivery
 * @param {string} req.body.pickupAddress - Address for pickup
 * @param {string} req.body.deliveryAddress - Address for delivery
 * @param {Date} req.body.pickupDate - Date for pickup
 * @param {Date} [req.body.deliveryDate] - Date for delivery
 * @param {string} [req.body.currentLocation] - Current location of the delivery
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with created delivery tracking details
 */
exports.createDelivery = async (req, res) => {
  try {
    const newDelivery = await Delivery.create(req.body);
    res.status(HTTP_STATUS.CREATED).json(newDelivery);
  } catch (error) {
    handleError(res, error);
  }
};
