const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

    const DeliveryTracking = sequelize.define("DeliveryTracking", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        donationId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(
                'Pending Pickup',
                'Picked Up',
                'In Transit',
                'Delivered',
                'Cancelled'
            ),
            allowNull: false,
            defaultValue: 'Pending Pickup'
        },
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        timestamp: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        notes: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false
    });
    module.exports = DeliveryTracking;
