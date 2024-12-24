// Required modules
const fs = require('fs'); // For reading the JSON file
const path = require('path');
const GymnasticsSkill = require('./models/GymnasticsSkill'); // Your GymnasticsSkill model
const sequelize = require('./config/database'); // Your database config

// Read and parse the JSON file
const skillsFilePath = path.join(__dirname, 'skills.json'); // Make sure the path to your JSON file is correct

function getGroup(group){
    switch (group){
        case "I ":
            return 1;
        case "II":
            return 2;
        case "III":
            return 3;
        case "IV":
            return 4;
        case "V":
            return 5;
        default:
            console.log(group);
            console.log("Something went wrong")
            return "this will cause an error"
    }
}

// Define a function to load skills into the database
async function loadSkills() {
    try {
        // Synchronize the models with the database
        await sequelize.sync(); // This ensures that your models are ready (tables created)

        // Read the JSON file
        const data = fs.readFileSync(skillsFilePath, 'utf-8');
        const skillsData = JSON.parse(data); // Parse the JSON into an object

        // Loop through each apparatus and its skills
        for (const apparatus in skillsData) {
            if (skillsData.hasOwnProperty(apparatus)) {
                const skills = skillsData[apparatus];

                // For each skill, insert into the database
                for (const skill of skills) {
                    await GymnasticsSkill.create({
                        name: skill.Name,
                        difficulty: skill.difficulty,
                        apparatus: skill.apparatus,
                        group: getGroup(skill.group.replace(":", "")), // Convert group string to integer
                        isPenaltyRequirement: false // Default value as per your requirements
                    });
                }
            }
        }

        console.log('All skills have been successfully added to the database.');
    } catch (err) {
        console.error('Error loading skills into the database:', err);
    } finally {
        // Close the database connection
        await sequelize.close();
    }
}

// Function to load skills from JSON file and reset database
async function resetSkills() {
    try {
        // Step 1: Load skills data from JSON file
        const skillsData = JSON.parse(fs.readFileSync('skills.json', 'utf-8'));

        // Step 2: Start the database transaction
        await sequelize.transaction(async (t) => {

            // Step 3: Delete all existing skills
            await GymnasticsSkill.destroy({ where: {}, truncate: true }, { transaction: t });
            console.log('All existing skills have been deleted.');

            // Step 4: Insert new skills
            for (const apparatus in skillsData) {
                const skills = skillsData[apparatus];
                
                // For each skill in the JSON, add it to the database
                for (const skill of skills) {
                    console.log(skill.group);
                    await GymnasticsSkill.create({
                        name: skill.Name,
                        difficulty: skill.difficulty,
                        apparatus: skill.apparatus,
                        group: getGroup(skill.group),
                        isPenaltyRequirement: false // Assuming this is always false
                    }, { transaction: t });
                }
            }

            console.log('New skills have been added.');
        });
    } catch (error) {
        console.error('Error resetting the skills:', error);
    }
}

// Run the resetSkills function
loadSkills();
