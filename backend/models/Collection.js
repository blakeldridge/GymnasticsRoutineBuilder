const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Collection = sequelize.define('Collection', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },    
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id',
        },
        allowNull: false,
    },
},
{
    tableName : 'Collections',
});

module.exports = Collection;