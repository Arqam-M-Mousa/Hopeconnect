const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orphanageHelpRequests = sequelize.define('orphanageHelpRequests', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, title: {
        type: DataTypes.STRING, allowNull: false, validate: {
            len: [5, 150]
        }
    }, description: {
        type: DataTypes.TEXT, allowNull: false
    }, requestType: {
        type: DataTypes.ENUM('medical', 'educational', 'maintenance', 'supplies', 'other'), allowNull: false
    }, urgencyLevel: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'critical'), defaultValue: 'medium'
    }, requiredSkills: {
        type: DataTypes.TEXT
    }, startDate: {
        type: DataTypes.DATE
    }, endDate: {
        type: DataTypes.DATE
    }, status: {
        type: DataTypes.ENUM('open', 'in_progress', 'completed', 'cancelled'), defaultValue: 'open'
    }, orphanageId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'orphanages', key: 'id'
        }
    }
}, {
    timestamps: true
});

module.exports = orphanageHelpRequests;
