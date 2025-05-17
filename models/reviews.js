const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const review = sequelize.define('reviews', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        orphanId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Orphans',
                key: 'id'
            }
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5
            }
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: [10, 500]
            }
        }
}, {
    timestamps: true
});

module.exports = review;