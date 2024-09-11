const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Routine = sequelize.define('Routine', {
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    apparatus: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    skills: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    difficulty: {
        type: DataTypes.JSON,
        allowNull: false,
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
        allowNull: false,
    },
});

module.exports = Routine;