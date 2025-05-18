const Delivery = require('../models/deliveryTracking');
const {getPaginationParams, formatPaginatedResponse} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require("../utils/responses");

exports.getById = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);
        if (!delivery) return res.status(HTTP_STATUS.NOT_FOUND).json({error: 'Delivery not found'});
        res.status(HTTP_STATUS.OK).json(delivery);
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateDelivery = async (req, res) => {
    try {
        const delivery = await Delivery.findByPk(req.params.id);

        if (!delivery) return res.status(HTTP_STATUS.NOT_FOUND).json({error: 'Delivery not found'});

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
        const {id} = req.params;
        const delivery = await Delivery.findByPk({where: {id}});
        if (!delivery) return res.status(HTTP_STATUS.NOT_FOUND).json({error: 'Delivery not found'});
        await delivery.destroy();
        res.status(HTTP_STATUS.OK).json({message: 'Delivery deleted successfully'});
    } catch (error) {
        handleError(res, error);
    }
};

exports.getCurrentLocation = async (req, res) => {
    try {
        const {id} = req.params;
        const delivery = await Delivery.findByPk(id, {
            attributes: ['id', 'currentLocation']
        });

        if (!delivery) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({error: 'Delivery not found'});
        }

        res.json({currentLocation: delivery.currentLocation});
    } catch (error) {
        handleError(res, error);
    }
};


exports.getAllDeliveries = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const deliveries = await Delivery.findAndCountAll({
            limit, offset, order: [['createdAt', 'DESC']]
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
