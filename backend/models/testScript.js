const sequelize = require('../config/database'); // Adjust the path as needed
const Routine = require('./Routine'); // Adjust the path as needed

async function syncTable() {
    try {
        // Sync only the User model table
        await Routine.sync({ force: true }); // Drops the User table if it exists and recreates it
        console.log('User table has been synchronized.');

        // If needed, synchronize other models separately or add logic for them
    } catch (error) {
        console.error('Error syncing User table:', error);
    }
}

syncTable();