const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Orphanage = sequelize.define('Orphanage', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    contactPerson: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            isEmail: true
        }
    },
    description: {
        type: DataTypes.TEXT
    },
    isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    }
});

module.exports = Orphanage;