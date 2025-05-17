const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orphans = sequelize.define('orphans', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, name: {
        type: DataTypes.STRING, allowNull: false
    }, age: {
        type: DataTypes.INTEGER, allowNull: false, validate: {
            min: 0, max: 18
        }
    }, gender: {
        type: DataTypes.ENUM('male', 'female'), allowNull: false
    }, educationStatus: {
        type: DataTypes.STRING
    }, healthCondition: {
        type: DataTypes.TEXT
    }, background: {
        type: DataTypes.TEXT
    }, orphanageId: {
        type: DataTypes.INTEGER, allowNull: false
    }, profileImage: {
        type: DataTypes.STRING
    }, isAvailableForSponsorship: {
        type: DataTypes.BOOLEAN, defaultValue: true
    }, timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

});

module.exports = orphans;