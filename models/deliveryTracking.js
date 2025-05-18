const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const deliveryTracking = sequelize.define('deliveryTracking', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, donationId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'donations', key: 'id'
        }
    }, status: {
        type: DataTypes.ENUM,
        values: ['PENDING', 'ASSIGNED', 'PICKUP_IN_PROGRESS', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'],
        defaultValue: 'PENDING'
    }, pickupAddress: {
        type: DataTypes.STRING, allowNull: false
    }, deliveryAddress: {
        type: DataTypes.STRING, allowNull: false
    }, pickupDate: {
        type: DataTypes.DATE, allowNull: false
    }, deliveryDate: {
        type: DataTypes.DATE, allowNull: true
    }, currentLocation: {
        type: DataTypes.STRING, allowNull: true
    }
}, {
    timestamps: true
});

module.exports = deliveryTracking;