const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const DonationsTracking = sequelize.define('donationsTracking', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, donationId: {
        type: DataTypes.INTEGER, allowNull: false
    }, status: {
        type: DataTypes.ENUM('received', 'processing', 'shipped', 'delivered', 'thanked'), allowNull: false
    }, title: {
        type: DataTypes.STRING, allowNull: false
    }, description: {
        type: DataTypes.TEXT, allowNull: false
    }, imageUrl: {
        type: DataTypes.STRING
    }, isRead: {
        type: DataTypes.BOOLEAN, defaultValue: false
    }, createdBy: {
        type: DataTypes.INTEGER, allowNull: false
    }, createdAt: {
        type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
    }, updatedAt: {
        type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW
    }
}, {
    timestamps: true,
    paranoid: true,
});

module.exports = DonationsTracking;
