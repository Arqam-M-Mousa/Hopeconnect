const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const orphan = sequelize.define('orphan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    gender: {
        type: DataTypes.ENUM('male', 'female'),
        allowNull: false
    },
    educationStatus: {
        type: DataTypes.STRING
    },
    healthCondition: {
        type: DataTypes.TEXT
    },
    background: {
        type: DataTypes.TEXT
    },
    orphanageId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    profileImage: {
        type: DataTypes.STRING
    },
    isAvailableForSponsorship: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = orphan;