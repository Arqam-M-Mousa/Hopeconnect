const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const orphanage = sequelize.define('orphanage', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, name: {
        type: DataTypes.STRING, allowNull: false, validate: {
            len: [2, 150]
        }
    }, address: {
        type: DataTypes.TEXT, allowNull: false
    }, contactPerson: {
        type: DataTypes.STRING, allowNull: false, validate: {
            len: [2, 100]
        }
    }, phone: {
        type: DataTypes.STRING, allowNull: false, validate: {
            is: /^[0-9+\-\s()]{7,20}$/i
        }
    }, email: {
        type: DataTypes.STRING, validate: {
            isEmail: true
        }
    }, description: {
        type: DataTypes.TEXT
    }, isVerified: {
        type: DataTypes.BOOLEAN, defaultValue: false
    }, rating: {
        type: DataTypes.FLOAT, defaultValue: 0, validate: {
            min: 0, max: 5
        }
    }
}, {
    timestamps: true  // Adds createdAt and updatedAt
});

module.exports = orphanage;
