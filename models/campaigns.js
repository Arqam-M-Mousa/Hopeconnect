const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const campaigns = sequelize.define('campaigns', {
    id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: DataTypes.TEXT,
    goalAmount: DataTypes.DECIMAL(10, 2),
    currentAmount: DataTypes.DECIMAL(10, 2),
    isEmergency: {type: DataTypes.BOOLEAN, defaultValue: false}
});

module.exports = campaigns;