const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const User = require('./models/User');
const Routine = require('./models/Routine.js');
const GymnasticsSkill = require('./models/GymnasticsSkill');

const app = express();
app.use(express.json());

sequelize.sync()
    .then(() => {
        console.log('SQLite database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Define your routes here

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name:username, password: hashedPassword });
        res.status(201).json({ id: user.id });
    } catch (error) {
        console.error('Error during signup:', error); // Log the error details
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { name:username } });
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, 'your_jwt_secret');
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});
// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).json({ error: 'No token provided' });

    jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Failed to authenticate token' });

        // Save user ID in request for use in other routes
        req.userId = decoded.id;
        next();
    });
};

// Route to get user details (protected)
app.get('/api/user/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    // Check if the ID in the token matches the ID being requested
    if (parseInt(id, 10) !== req.userId) { // Ensure both are numbers
        return res.status(403).json({ error: 'Unauthorized access' });
    }

    try {
        const user = await User.findOne({ where: { id: id } });
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user.' });
    }
});

// Route to get all routines of a user by id
app.get('/api/user/routines/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    try {
        const routines = await Routine.findAll({ where : { userId:id }});
        res.status(200).json(routines);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get routine by id
app.get('/api/routines/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const routine = await Routine.findByPk(id);
        res.status(200).json(routine);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

// Route to save new routine as favourite
app.post('/api/routines/favourite/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const routine = await Routine.findByPk(id);
        if (!routine) {
            return res.status(404).json({error: 'Routine not found'});
        }

        if (status){
            const currentRoutine = await Routine.findOne({ 
                where : {
                    apparatus : routine.apparatus,
                    isActive: true,
                    userId: routine.userId
                }});

            if (currentRoutine) {
                console.log(currentRoutine);
                currentRoutine.isActive = false;
                await currentRoutine.save();
            }
    
            routine.isActive = true;
            await routine.save();
        } else {
            routine.isActive = false;
            await routine.save();
        }
        res.status(200).json({message: 'Routine updated successfully'});
    } catch (error) {
        console.error('Error activating routine:', error);
        res.status(500).json({ error: error.message });
    }
});

// Save routine to profile (protected)
app.post('/api/routines/save', verifyToken, async (req, res) => {
    const { name, apparatus, routine, difficulty, userId } = req.body;

    try {
        await Routine.create({
            name: name,
            userId: userId, 
            apparatus: apparatus,
            skills: routine,
            difficulty: JSON.stringify(difficulty),
        });

        res.status(201).json({ message: 'Routine saved successfully' });
    } catch (error) {
        console.error('Error saving routine:', error);
        res.status(500).json({ message: 'Error saving routine' });
    }
});

// Route to add a new skill
app.post('/api/skills', async (req, res) => {
    try {
        const skill = await GymnasticsSkill.create(req.body);
        res.status(201).json(skill);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Route to delete a skill
app.delete('/api/skills/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const skill = await GymnasticsSkill.findByPk(id);

        if (!skill) {
            return res.status(404).json({ message: 'Skill not found' });
        }

        await skill.destroy();
        res.status(200).json({ message: 'Skill deleted successfully' });
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

// Route to get all skills
app.get('/api/skills', async (req, res) => {
    try {
        const skills = await GymnasticsSkill.findAll();
        res.status(200).json(skills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get all skills for one apparatus
app.get('/api/skills/by-apparatus/:apparatus', async (req, res) => {
    const { apparatus } = req.params;

    try {
        if (!apparatus) {
            return res.status(400).json({ message: 'Apparatus type is required' });
        }

        // Fetch skills based on the apparatus type
        const skills = await GymnasticsSkill.findAll({
            where: {
                apparatus: apparatus // Adjust based on your model's field name
            }
        });

        if (skills.length > 0) {
            res.status(200).json(skills);
        } else {
            res.status(404).json([{ message: 'No skills found for this apparatus' }]);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json([{ message: 'An error occurred' }]);
    }
});

// Route to get all skills in an element group for an apparatus
app.get('/api/skills/by-apparatus/:apparatus/by-group/:group', async (req, res) => {
    const { apparatus, group } = req.params;

    try {
        if (!apparatus) {
            return res.status(400).json({ message: 'Apparatus type is required' });
        }

        // Fetch skills based on the apparatus type
        const skills = await GymnasticsSkill.findAll({
            where: {
                apparatus: apparatus,
                group: group
            }
        });

        if (skills.length > 0) {
            res.status(200).json(skills);
        } else {
            res.status(404).json([{ message: 'No skills found for this apparatus' }]);
        }
    } catch (error) {
        console.error('Error fetching skills:', error);
        res.status(500).json([{ message: 'An error occurred' }]);
    }
});

// Route to get skill by id
app.get('/api/skills/:id', async (req, res) => {
    const { id } = req.params;

    try {
        if (!id){
            return res.status(400).json({ message: 'Apparatus type is required' });
        }

        const skill = await GymnasticsSkill.findByPk(id);

        if (skill) {
            res.status(200).json(skill);
        } else {
            res.status(400).json({ message: 'No skill found' });
        }
    } catch (error) {
        console.error('Error fetching skill:', error);
        res.status(500).json([{ message: 'An error occured'}]);
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
