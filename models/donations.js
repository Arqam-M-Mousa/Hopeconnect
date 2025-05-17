const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Donation = sequelize.define('Donation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('general-funds', 'education', 'medical', 'emergency'),
        defaultValue: 'general'
    },
    donationType: {
        type: DataTypes.ENUM('money', 'clothes', 'food', 'educational', 'other'),
        defaultValue: 'money'
    },
    description: {
        type: DataTypes.TEXT
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending'
    },
    donorId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    orphanageId: {
        type: DataTypes.INTEGER
    },
    orphanId: {
        type: DataTypes.INTEGER
    },
    transactionId: {
        type: DataTypes.STRING
    }
});

module.exports = Donation;