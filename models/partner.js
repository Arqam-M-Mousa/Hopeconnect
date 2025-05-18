const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const partner = sequelize.define('partners', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM('NGO', 'charity', 'humanitarian'), allowNull: false },
    contactEmail: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    phone: { type: DataTypes.STRING, allowNull: true },
    address: { type: DataTypes.STRING, allowNull: true },
    description: { type: DataTypes.TEXT, allowNull: true },
}, { timestamps: true });

module.exports = partner;
