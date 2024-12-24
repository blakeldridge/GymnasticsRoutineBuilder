const sequelize = require('../config/database');
const User = require('./User');

async function syncDatabase() {
    try {
        await User.sync({ force: true }); // Auto-sync the database schema
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

syncDatabase();