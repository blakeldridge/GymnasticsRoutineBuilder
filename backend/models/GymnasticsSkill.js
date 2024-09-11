const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GymnasticsSkill = sequelize.define('GymnasticsSkill', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    difficulty: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    apparatus: {
        type: DataTypes.STRING,
        allowNull: false
    },
    group: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isPenaltyRequirement: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
});

module.exports = GymnasticsSkill;