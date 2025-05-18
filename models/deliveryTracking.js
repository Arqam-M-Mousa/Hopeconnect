const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const deliveryLocation = sequelize.define('deliveryLocation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    deliveryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'deliveryTracking',
            key: 'id'
        }
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});

module.exports = deliveryLocation;
