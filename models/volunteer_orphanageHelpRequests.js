const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const volunteer_orphanageHelpRequests = sequelize.define('volunteers_orphanageHelpRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  volunteerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'volunteers',
      key: 'id'
    }
  },
  helpRequestId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'orphanageHelpRequests',
      key: 'id'
    }
  },
  appliedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
});

module.exports = volunteer_orphanageHelpRequests;
