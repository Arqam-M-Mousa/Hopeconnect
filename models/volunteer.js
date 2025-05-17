const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Volunteer = sequelize.define('volunteers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: {
            model: 'users', // assumes users table already exists
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    servicesOffered: {
        type: DataTypes.ARRAY(DataTypes.ENUM('teaching', 'mentoring', 'healthcare', 'counseling', 'sports', 'arts', 'other')),
        allowNull: false
    },
    availability: {
        type: DataTypes.STRING, // e.g., "Weekends", "Evenings", or a structured format
        allowNull: true
    },
    preferredLocation: {
        type: DataTypes.STRING, // could be city, region, or orphanage name
        allowNull: true
    },
    skills: {
        type: DataTypes.TEXT // optional detailed description of skills
    },
    experience: {
        type: DataTypes.TEXT // optional background
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});
