const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orphanageHelpRequest = sequelize.define('orphanageHelpRequest', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, title: {
        type: DataTypes.STRING, allowNull: false
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
        type: DataTypes.INTEGER, allowNull: false
    }
});

module.exports = orphanageHelpRequest;