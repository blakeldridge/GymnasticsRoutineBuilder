const sequelize = require('../config/database');
const { Op } = require('sequelize');
const User = require('./User');
const GymnasticsSkill = require('./GymnasticsSkill');

async function syncDatabase() {
    try {
        await User.sync({ force: true }); // Auto-sync the database schema
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
}

async function fixAbbreviations() {
    const subStrings = ['hstd', 'strad', 'str', 'sup', 'bwd', 'fwd', 'dbl', '½'];
    const replacement = ['handstand', 'straddle', 'straight', 'support', 'backward', 'forward', 'double', '1/2'];
    const whereConditions = subStrings.map(substring => ({
        [Op.like] : `%${substring}%`
    }));
    try {
        const skillNames = await GymnasticsSkill.findAll({where : {
            name : {
                [Op.or] : whereConditions
            }
        }})

        for (const skill of skillNames) {
            let updatedName = skill.name;

            for (let i = 0; i < subStrings.length; i++) {
                if (replacement[i] == '1/2'){
                    updatedName = updatedName.replace(`/${subStrings[i]}/g`, replacement[i]);
                } else{
                    updatedName = updatedName.replace(`/${subStrings[i]}\./g`, replacement[i]);
                }            
            }
        }

        if (updatedName != skill.name) {
            await skill.update({ name: updatedName });
            console.log(`Updated skill name: ${skill.name} => ${updatedName}`);
        }


    } catch (error) {
        console.error('Error fixing abbreviations: ', error);
    }
}

fixAbbreviations();