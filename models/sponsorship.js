const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const sponsorship = sequelize.define('sponsorship', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    sponsorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orphanId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    startDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    endDate: {
        type: DataTypes.DATE
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    frequency: {
        type: DataTypes.ENUM('monthly', 'quarterly', 'yearly', 'one-time'),
        defaultValue: 'monthly'
    },
    status: {
        type: DataTypes.ENUM('active', 'paused', 'ended'),
        defaultValue: 'active'
    },
    notes: {
        type: DataTypes.TEXT
    }
});

module.exports = sponsorship;