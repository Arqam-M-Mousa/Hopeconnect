const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const DonationUpdate = sequelize.define('DonationUpdate', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    donationId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
});

console.log('DonationUpdate model defined successfully!');

module.exports = DonationUpdate;
