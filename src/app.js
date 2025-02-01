const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post('/signup', async (req, res)=> {
    //Creating a new instance of the user model
    const user = new User(req.body || {});

    try {
        await user.save();
        res.send('User added successfully');
    } catch(err) {
        res.status(400).send('Error saving the user: ' + err.message);
    }
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
    console.log(req.body);
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.status(200).send('User deleted successfully');
    } catch (err){
        res.status(400).send('Something went wrong');
    }
});

//Update User data
app.patch('/user', async (req, res)=> {
    const userId = req.body.userId;
    const data = req.body;
    try {
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