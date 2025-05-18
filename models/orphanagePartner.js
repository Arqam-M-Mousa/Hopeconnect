const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const orphanagePartner = sequelize.define('orphanage_partners', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orphanageId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orphanages',
            key: 'id'
        }
    },
    partnerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'partner',
            key: 'id'
        }
    },
    partnershipStatus: {
        type: DataTypes.ENUM('active', 'pending', 'inactive'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = orphanagePartner;
