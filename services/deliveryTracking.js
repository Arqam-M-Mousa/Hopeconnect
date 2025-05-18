const Delivery = require('../models/deliveryTracking');
const DeliveryLocation = require('../models/deliveryLocation');
const { getPaginationParams, formatPaginatedResponse } = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require("../utils/responses");
const {Orphanage} = require("../models");

exports.getByDonationId = async (req, res) => {
    try {
        const { donationId } = req.params;
        const deliveries = await Delivery.findAll({ where: { donationId} });
        res.status(HTTP_STATUS.OK).json(deliveries);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getById = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);
        if (!delivery) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Delivery not found' });
        res.json(delivery);
    } catch (error) {
       handleError(res, error);
    }
};

exports.updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Delivery not found' });

        await delivery.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Delivery updated successfully", delivery: delivery
        });

    } catch (error) {
      handleError(res, error);
    }
};

exports.deleteDelivery = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Delivery.destroy({ where: { id } });
        if (!deleted) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Delivery not found' });
        res.json({ message: 'Delivery deleted successfully' });
    } catch (error) {
   handleError(res, error);
    }
};

exports.getCurrentLocation = async (req, res) => {
    try {
        const { id } = req.params;
        const location = await DeliveryLocation.findOne({
            where: { deliveryId: id },
            order: [['createdAt', 'DESC']]
        });
        if (!location) return res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Location not found' });
        res.json(location);
    } catch (error) {
        handleError(res, error);
    }
};

exports.getAllDeliveries = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const deliveries = await Delivery.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });
        const response = formatPaginatedResponse(deliveries, page, limit);
        res.status(HTTP_STATUS.OK).json(response);
    } catch (error) {
        handleError(res, error);
    }
};

exports.createDelivery = async (req, res) => {
    try {
        const newDelivery = await Delivery.create(req.body);
        res.status(HTTP_STATUS.CREATED).json(newDelivery);
    } catch (error) {
        handleError(res, error);
    }
};
