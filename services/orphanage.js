const {Orphanage, Orphan,OrphanageHelpRequest} = require('../models/index.js');
const sequelize = require('../config/database');
const {formatPaginatedResponse, getPaginationParams} = require('../utils/pagination');
const {HTTP_STATUS, handleError} = require('../utils/responses');

const ORPHANAGE_STATISTICS_QUERY = `
    SELECT o.id,
           o.name,
           o.isVerified,
           COUNT(DISTINCT orph.id) as orphanCount,
           COUNT(DISTINCT hr.id)   as helpRequestCount,
           MAX(o.updatedAt)        as lastUpdated
    FROM Orphanages o
             LEFT JOIN Orphans orph ON o.id = orph.orphanageId
             LEFT JOIN OrphanageHelpRequests hr ON o.id = hr.orphanageId
    GROUP BY o.id, o.name, o.isVerified
    ORDER BY o.name ASC
`;

const calculateOrphanageStatistics = (totalOrphanages, totalOrphans, orphanageStats) => ({
    summary: {
        totalOrphanages,
        totalOrphans,
        averageOrphansPerOrphanage: totalOrphanages ? (totalOrphans / totalOrphanages).toFixed(2) : 0,
        verifiedOrphanages: orphanageStats.filter(o => o.isVerified).length
    },
    orphanages: orphanageStats.map(formatOrphanageStats)
});

const formatOrphanageStats = (orphanage) => ({
    id: orphanage.id,
    name: orphanage.name,
    orphanCount: orphanage.orphanCount,
    helpRequestCount: orphanage.helpRequestCount,
    isVerified: orphanage.isVerified,
    lastUpdated: orphanage.lastUpdated
});

exports.getOrphanages = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const result = await Orphanage.findAndCountAll({
            limit,
            offset,
            order: [["rating", "DESC"]]
        });

        if (!result.rows.length) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanages not found" });
        }

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getOrphanageById = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanage not found" });
        }

        res.status(HTTP_STATUS.OK).json(orphanage);
    } catch (error) {
        handleError(res, error);
    }
};

exports.createOrphanage = async (req, res) => {
    try {
        const newOrphanage = await Orphanage.create(req.body);
        res.status(HTTP_STATUS.CREATED).json({
            message: "Orphanage created successfully",
            orphanage: newOrphanage
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanage not found" });
        }

        await orphanage.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Orphanage updated successfully",
            orphanage
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteOrphanage = async (req, res) => {
    try {
        const orphanage = await Orphanage.findByPk(req.params.id);

        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanage not found" });
        }

        const orphanCount = await Orphan.count({
            where: { orphanageId: req.params.id }
        });

        if (orphanCount > 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                message: "Cannot delete orphanage with associated orphans",
                orphanCount
            });
        }

        await orphanage.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Orphanage deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getStatistics = async (req, res) => {
    try {
        const [totalOrphanages, totalOrphans, orphanageStats] = await Promise.all([
            Orphanage.count(),
            Orphan.count(),
            sequelize.query(ORPHANAGE_STATISTICS_QUERY, {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            })
        ]);

        const statistics = calculateOrphanageStatistics(totalOrphanages, totalOrphans, orphanageStats);
        res.status(HTTP_STATUS.OK).json({ status: 'success', data: statistics });
    } catch (error) {
        handleError(res, error);
    }
};

exports.getHelpRequests = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const result = await OrphanageHelpRequest.findAndCountAll({
            limit,
            offset,
            order: SORT_ORDER.CREATED_DESC
        });

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getOrphanageHelpRequests = async (req, res) => {
    try {
        const { page, limit, offset } = getPaginationParams(req.query);
        const orphanageId = req.params.id;

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanage not found" });
        }

        const result = await OrphanageHelpRequest.findAndCountAll({
            where: { orphanageId },
            limit,
            offset,
            order: SORT_ORDER.CREATED_DESC
        });

        res.status(HTTP_STATUS.OK).json(formatPaginatedResponse(result, page, limit));
    } catch (error) {
        handleError(res, error);
    }
};

exports.getHelpRequestById = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Help request not found" });
        }
        res.status(HTTP_STATUS.OK).json(helpRequest);
    } catch (error) {
        handleError(res, error);
    }
};

exports.createHelpRequest = async (req, res) => {
    try {
        const { title, description, requestType, urgencyLevel, requiredSkills, startDate, endDate } = req.body;
        const orphanageId = req.params.id;

        const orphanage = await Orphanage.findByPk(orphanageId);
        if (!orphanage) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Orphanage not found" });
        }

        const helpRequest = await OrphanageHelpRequest.create({
            title, description, requestType, urgencyLevel, requiredSkills, startDate, endDate, orphanageId
        });

        res.status(HTTP_STATUS.CREATED).json({
            message: "Help request created successfully",
            helpRequest
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.updateHelpRequest = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Help request not found" });
        }

        await helpRequest.update(req.body);
        res.status(HTTP_STATUS.OK).json({
            message: "Help request updated successfully",
            helpRequest
        });
    } catch (error) {
        handleError(res, error);
    }
};

exports.deleteHelpRequest = async (req, res) => {
    try {
        const helpRequest = await OrphanageHelpRequest.findByPk(req.params.id);
        if (!helpRequest) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Help request not found" });
        }

        await helpRequest.destroy();
        res.status(HTTP_STATUS.OK).json({
            message: "Help request deleted successfully"
        });
    } catch (error) {
        handleError(res, error);
    }
};
