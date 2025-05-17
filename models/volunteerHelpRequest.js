const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const volunteerHelpRequest = sequelize.define('volunteerHelpRequest', {
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

module.exports = volunteerHelpRequest;
