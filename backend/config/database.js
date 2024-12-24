const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres',
    port: 5432,
    logging: false,
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection to PostgreSQL has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the PostgreSQL database:', err);
    });

module.exports = sequelize;
