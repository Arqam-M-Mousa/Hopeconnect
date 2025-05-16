const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const sponsorships = sequelize.define('sponsorships', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, sponsorId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'users', key: 'id'
        }
    }, orphanId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'orphans', key: 'id'
        }
    }, startDate: {
        type: DataTypes.DATE, defaultValue: DataTypes.NOW
    }, endDate: {
        type: DataTypes.DATE
    }, amount: {
        type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: {
            min: 1.00
        }
    }, frequency: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'one-time'), defaultValue: 'monthly'
    }, status: {
        type: DataTypes.ENUM('active', 'paused', 'ended'), defaultValue: 'active'
    }, notes: {
        type: DataTypes.TEXT
    }
});

module.exports = sponsorships;