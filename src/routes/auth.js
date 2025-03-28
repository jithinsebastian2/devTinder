const express = require('express');
const bcrypt = require('bcrypt');

const authRouter = express.Router();
const User = require('../models/user');
const { validateSignUp } = require('../utils/validation');

/* 
Note:
 we can change the name of this route from authRouter to router if required.
 Because we are writing routing logic for auth router inside auth.js file only
*/

authRouter.post('/signup', async (req, res)=> {
    try {
        // Validation of Data
        validateSignUp(req);

        const {
            firstName, lastName, emailId, password, photoUrl, gender, age, about, skills } = req.body;

        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10);

        //Creating a new instance of the user model
        const user = new User({
            firstName,
            lastName,
            emailId,
            photoUrl,
            password: passwordHash,
            gender,
            age,
            about,
            skills,
        });
        await user.save();
        res.send('User added successfully');
    } catch(err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

authRouter.post('/login', async (req, res) => {
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

authRouter.post('/logout', async(req, res) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
    }).status(200).send('Logged out successfully');
});

module.exports = authRouter;
