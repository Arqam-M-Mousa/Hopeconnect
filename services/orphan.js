const {Orphan} = require('../models/index.js');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');


exports.createOrphan = async (req, res) => {
    try {
        const newOrphan = await Orphan.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Orphan created successfully", orphanage: newOrphan
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getOrphansAvailableForSponsorship = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Orphan.findAndCountAll({
            where: {isAvailableForSponsorship: true}, limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphan not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getOrphanById = async (req, res) => {
    try {
        const orphan = await Orphan.findByPk(req.params.id);

        if (!orphan) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphanage not found"});
        }

        res.status(HTTP_STATUS.OK).json(orphan);
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteOrphan = async (req, res) => {
    try {
        const orphan = await Orphan.findByPk(req.params.id);

        if (!orphan) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphan not found"});
        }

        await orphan.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Orphan deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateOrphan = async (req, res) => {
    try {
        const orphan = await Orphan.findByPk(req.params.id);

        if (!orphan) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphan not found"});
        }

        await orphan.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Orphan updated successfully", orphan
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getOrphans = async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query);
        const result = await Orphan.findAndCountAll({
            limit, offset, order: [["createdAt", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({message: "Orphan not found"});
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};