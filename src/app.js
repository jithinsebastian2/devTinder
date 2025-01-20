const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.post('/signup', async (req, res)=> {
    //Creating a new instance of the user model
    const user = new User({
        firstName: 'Jithin',
        lastName: 'Sebastian',
        emailId: 'jithin@gmail.com',
        password: 'jithin@1234'
    });

    try {
        await user.save();
        res.send('User added successfully');
    } catch(err) {
        res.status(400).send('Error saving the user: ' + err.message);
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