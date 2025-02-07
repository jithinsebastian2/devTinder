const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');
const { userAuth } = require('./middlewares/auth');
const { validateSignUp } = require('./utils/validation');

app.use(express.json()); // To parse the req data into JSON we are using express.json() parser/middleware
app.use(cookieParser()); // For parsing the cookie

app.post('/signup', async (req, res)=> {
    try {
        // Validation of Data
        validateSignUp(req);

        const { firstName, lastName, emailId, password, photoUrl } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            photoUrl,
            password: passwordHash,
        });
        await user.save();
        res.send('User added successfully');
    } catch(err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

app.post('/login', async (req, res) => {
    try {
       const { emailId, password } = req.body;
       const user = await User.findOne({ emailId });
       if (!user) {
        throw new Error('Invalid credentials');
       }
       console.log('user', user);
       const isPasswordValid = await user.validatePassword(password);
       if (isPasswordValid) {
        // Create a JWT Token
        const token = await user.getJWT();

        // Add the Token to the cookie and send the response back to the user
        res.cookie('token', token,
            {  
                expires: new Date(Date.now() + 900000), // Expiry date for the complete cookie
            });
        res.status(200).send('User logged in successfully');
       } else {
        throw new Error('Invalid credentials');
       }

    } catch(err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

app.get('/profile', userAuth, async (req, res)=> {
    try {
        // console.log('req', req.user);
        // const { token = null } = req?.cookies || {};
        // if (!token) {
        //     throw new Error('Invalid token');
        // }
        // // Validate my token
        // const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // const { _id = null } = decodedMessage;
        // const loggedInUser = await User.findById(_id);
        // if (!loggedInUser) {
        //     throw new Error('User not found');
        // }
        res.status(200).send(req.user);
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

app.post('/sendConnectionRequest', userAuth, async (req, res)=> {
    res.status(200).send(`${req?.user?.firstName} is sending the connection request`);
});

//Get User by email
app.get('/user', async (req, res)=> {
    try {
        const users = await User.find({ emailId: req.body.emailId});
        if (users.length > 0){
            res.send(users);
        } else {
            res.status(404).send('User not found');
        }
    } catch(err) {
        res.status(400).send('Something went wrong');
    }
});

// Find all the Users
app.get('/feed', async (req, res)=> {
    const users = await User.find({});
    try {
        res.send(users);
    } catch (err){
        res.status(400).send('Something went wrong');
    }
});

//Delete User by default mongoDB _id
app.delete('/user', async (req, res)=> {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.status(200).send('User deleted successfully');
    } catch (err){
        res.status(400).send('Something went wrong');
    }
});

//Update User data
app.patch('/user/:userId', async (req, res)=> {
    const userId = req.params?.userId; // req.body.userId;
    const data = req.body;

    try {
        const ALLOWED_UPDATES = [
            "userId", "photoUrl", "about", "gender", "age", "skills"
        ];
    
        if (!Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k))) {
           throw new Error("Update not allowed");
        }

        if (data.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate({ _id: userId }, data, {
            returnDocument: 'after',
            runValidators: true, // It will validate the conditions for each fields in the schema while updating
        });
        res.status(200).send('User updated successfully');
    } catch (err){
        res.status(400).send('Update Failed'+ err.message);
    }
});

connectDB().then(()=> {
    console.log('Database connection established');
    app.listen(7777, () => {
        console.log('Server is listening on port 7777');
    });
}).catch(err => {
    console.log('Database cannot be connected', err);
});