const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const user = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    }, name: {
        type: DataTypes.STRING, allowNull: false
    }, email: {
        type: DataTypes.STRING, allowNull: false, unique: true, validate: {
            isEmail: true
        }
    }, password: {
        type: DataTypes.STRING, allowNull: false
    }, role: {
        type: DataTypes.ENUM('admin', 'donor', 'volunteer'), defaultValue: 'donor'
    }, phone: {
        type: DataTypes.STRING, validate: {
            is: /^[0-9+\-\s()]{7,20}$/i
        }
    }, address: {
        type: DataTypes.TEXT
    }, profileImage: {
        type: DataTypes.STRING
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            user.password = await bcrypt.hash(user.password, 10);
        }, beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 10);
            }
        }, timestamps: true
    }
});

user.prototype.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = user;