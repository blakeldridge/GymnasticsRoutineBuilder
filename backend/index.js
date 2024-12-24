const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sequelize = require('./config/database');
const multer = require('multer');
const path = require('path');
const User = require('./models/User');
const Routine = require('./models/Routine.js');
const GymnasticsSkill = require('./models/GymnasticsSkill');
const Collection = require('./models/Collection.js');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

sequelize.sync()
    .then(() => {
        console.log('SQLite database & tables created!');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads/profile-pics')); // Directory to save the uploaded files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Unique filename
    }
});

const upload = multer({ storage: storage });


// Define your routes here

/* Log in and sign up endpoints */

// Signup endpoint
app.post('/api/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Username, email and password are required' });
        }

        const usernameFound = await User.findOne({ where : {name:username}});
        if (usernameFound) {
            return res.status(400).json({error : 'Username taken.'});
        }

        const emailFound = await User.findOne({ where : {email:email}});
        if (emailFound) {
            return res.status(400).json({error:'Email taken. Try logging in instead.'});
        } 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name:username, email: email, password: hashedPassword });
        res.status(201).json({ id: user.id });

    } catch (error) {
        // Handle different error cases
        if (error.name === 'SequelizeValidationError') {
            // Handle validation errors
            return res.status(400).json({ error: 'Invalid data format.' });
        } else if (error.name === 'SequelizeUniqueConstraintError') {
            // Handle unique constraint errors for fields like email or username
            return res.status(400).json({ error: 'A user with this email or username already exists.' });
        } else if (error.name === 'ValidationError') {
            // Handle errors from other validation issues (e.g., if the password doesn't meet criteria)
            return res.status(400).json({ error: 'Validation error occurred during signup.' });
        } else {
            // Handle any other unexpected errors
            console.error('Error during signup:', error); // Log the error details for debugging
            return res.status(500).json({ error: 'An unexpected error occurred during signup. Please try again later.' });
        }
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ where: { name:username } });
        if (!user) return res.status(401).json({ error: 'Username or Password is incorrect.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: 'Username or Password is incorrect.' });

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

/* USER ENDPOINTS */

// Route to update username
app.post('/api/user/:id/update-details/username', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }
        user.name = username;
        await user.save();
        res.status(200).json({message: 'User updated successfully'});
    } catch (error) {
        console.error('Error updating User:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to update profile picture
app.post(`/api/user/:id/update-details/pfp`, verifyToken, upload.single('profilePicture'), async (req, res) => {
    const { id } = req.params;
    const file = req.file;  // Access uploaded file

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (file) {
            user.profile_pic = `/uploads/profile-pics/${file.filename}`; // Set profile picture URL
        }

        await user.save();
        res.status(200).json({ message: 'User updated successfully', profile_pic: user.profile_pic });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: error.message });
    }
});



/* COLLECTION ENDPOINTS */

// Route to get all collections of a user
app.get('/api/user/:id/collections', async (req, res) => {
    const { id } = req.params;
    try{
        const collections = await Collection.findAll({ where : { userId : id }});
        res.status(200).json(collections);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to get specific collection by id
app.get('/api/user/:userId/collections/:id', async (req, res) => {
    const { userId, id } = req.params;
    try{
        const collection = await Collection.findOne({ where : { userId : userId, id: id }});
        res.status(200).json(collection);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route to add new collection
app.post('/api/user/:id/collections', async(req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const newCollection = await Collection.create({
            name: name,
            userId: id
        });

        res.status(201).json({ id: newCollection.id });
    } catch (error) {
        console.error('Error adding collection:', error);
        res.status(500).json({ message: 'Error  adding collection' });
    }
});

// Route to edit collection
app.post('/api/user/:userId/collections/:collectionId/update-details', async (req, res) => {
    const { collectionId } = req.params;
    const { name } = req.body;
    try {
        const collection = await Collection.findByPk(collectionId);
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        collection.name = name;
        await collection.save();
        
        res.status(200).json({ message: "Collection updated Successfully "});
    } catch (err) {
        console.error('Error updating Collection:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a collection
app.delete('/api/user/:userId/collections/:collectionId/delete', async (req, res) => {
    const { collectionId } = req.params;
    try {
        const result = await Collection.destroy({
            where: { id:collectionId }
        });
        console.log("Are we there yey");

        if (result) {
            const routinesInCollection = await Routine.findAll({
                where : {
                    collectionId: collectionId
                }
            })
    
            for (let routine of routinesInCollection) {
                routine.collectionId = null;
                await routine.save();
            }

            return res.status(200).send(`Collection with ID ${collectionId} deleted`);
        } else {
            return res.status(404).send('Collection not found');
        }

    } catch (error) {
        return res.status(500).send('Error deleting Collection: ' + error);
    }
});

/* ROUTINE ENDPOINTS */

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
    const { name, apparatus, routine, difficulty, userId, collectionId } = req.body;

    try {

        if (collectionId) {
            const existingRoutine = await Routine.findOne({
                where : {
                    collectionId : collectionId,
                    apparatus : apparatus,
                }
            })
                   
            if (existingRoutine) {
                existingRoutine.collectionId = null;
                await existingRoutine.save();
            }
        } 

        const newRoutine = await Routine.create({
            name: name,
            userId: userId, 
            apparatus: apparatus,
            skills: routine,
            difficulty: difficulty,
            collectionId: collectionId
        });

        res.status(201).json({ message: 'Routine saved successfully', id: newRoutine.id });
    } catch (error) {
        console.error('Error saving routine:', error);
        res.status(500).json({ message: 'Error saving routine' });
    }
});

// Route to save existing routine
app.post('/api/routines/save/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, apparatus, routine, difficulty, userId, collectionId } = req.body;

    try {
        const currentRoutine = await Routine.findByPk(id);
        if (!currentRoutine) {
            return res.status(404).json({error: 'Routine not found'});
        }
        
        currentRoutine.name = name;
        currentRoutine.apparatus = apparatus;
        currentRoutine.skills = routine;
        currentRoutine.difficulty = difficulty;
        currentRoutine.userId = userId;
        currentRoutine.collectionId = collectionId;

        await currentRoutine.save();

        res.status(200).json({message: 'Routine updated successfully'});
    } catch (error) {
        console.error('Error activating routine:', error);
        res.status(500).json({ error: error.message });
    }
});

// Route to delete a routine
app.delete('/api/routines/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Routine.destroy({
            where: {
                id: id,
            }
        })

        if (result) {
            return res.status(200).send(`Routine with ID ${id} deleted`);
        } else {
            return res.status(404).send('Routine not found');
        }
    } catch (error) {
        return res.status(500).send('Error deleting Routine: ' + error);
    }
});

/* SKILL ENDPOINTS */

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
