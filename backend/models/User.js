const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password :{
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_pic :{
        type: DataTypes.UUID,
        allowNull: true
    }
});

module.exports = User;