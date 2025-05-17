const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('donations', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, amount: {
        type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: {
            min: 0.01
        }
    }, category: {
        type: DataTypes.ENUM('general-funds', 'education', 'medical', 'emergency'),
        defaultValue: 'general-funds',
        allowNull: false
    }, donationType: {
        type: DataTypes.ENUM('money', 'clothes', 'food', 'educational', 'other'),
        defaultValue: 'money',
        allowNull: false
    }, description: {
        type: DataTypes.TEXT
    }, status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'), defaultValue: 'pending', allowNull: false
    }, donorId: {
        type: DataTypes.INTEGER, allowNull: false
    }, orphanageId: {
        type: DataTypes.INTEGER, allowNull: false
    }, sponsorshipId: {
        type: DataTypes.INTEGER,
    }, transactionId: {
        type: DataTypes.STRING, allowNull: false, unique: true,
    }, createdBy: {
        type: DataTypes.INTEGER, allowNull: false
    }
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = Donation;