const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orphanage_partnerships = sequelize.define('orphanages_partnerships', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}, orphanageId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'orphanages', key: 'id'
        }
    }, partnerId: {
        type: DataTypes.INTEGER, allowNull: false, references: {
            model: 'partner', key: 'id'
        }
    }, partnershipStatus: {
        type: DataTypes.ENUM('active', 'pending', 'inactive'), defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = orphanage_partnerships;
