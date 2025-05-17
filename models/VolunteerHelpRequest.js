const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const VolunteerHelpRequest = sequelize.define('volunteer_help_requests', {
    volunteerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'volunteers',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    helpRequestId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'orphanageHelpRequests',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    status: {
        type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'completed'),
        defaultValue: 'pending'
    }
}, {
    timestamps: true
});

module.exports = VolunteerHelpRequest;
