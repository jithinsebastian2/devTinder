const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./config/database');
const app = express();

app.use(cors({ // Options to whiteList the request origins domain names
    origin: 'http://localhost:5173',
    credentials: true, // To store the cookie and all (Need research on this)
}));
app.use(express.json()); // To parse the req data into JSON we are using express.json() parser/middleware
app.use(cookieParser()); // For parsing the cookie

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);

connectDB().then(()=> {
    console.log('Database connection established');
    app.listen(7777, () => {
        console.log('Server is listening on port 7777');
    });
}).catch(err => {
    console.log('Database cannot be connected', err);
});

//Get User by email
// app.get('/user', async (req, res)=> {
//     try {
//         const users = await User.find({ emailId: req.body.emailId});
//         if (users.length > 0){
//             res.send(users);
//         } else {
//             res.status(404).send('User not found');
//         }
//     } catch(err) {
//         res.status(400).send('Something went wrong');
//     }
// });

// // Find all the Users
// app.get('/feed', async (req, res)=> {
//     const users = await User.find({});
//     try {
//         res.send(users);
//     } catch (err){
//         res.status(400).send('Something went wrong');
//     }
// });

// //Delete User by default mongoDB _id
// app.delete('/user', async (req, res)=> {
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete({ _id: userId });
//         res.status(200).send('User deleted successfully');
//     } catch (err){
//         res.status(400).send('Something went wrong');
//     }
// });

// //Update User data
// app.patch('/user/:userId', async (req, res)=> {
//     const userId = req.params?.userId; // req.body.userId;
//     const data = req.body;

//     try {
//         const ALLOWED_UPDATES = [
//             "userId", "photoUrl", "about", "gender", "age", "skills"
//         ];
    
//         if (!Object.keys(data).every(k=> ALLOWED_UPDATES.includes(k))) {
//            throw new Error("Update not allowed");
//         }

//         if (data.skills.length > 10) {
//             throw new Error("Skills cannot be more than 10");
//         }

//         const user = await User.findByIdAndUpdate({ _id: userId }, data, {
//             returnDocument: 'after',
//             runValidators: true, // It will validate the conditions for each fields in the schema while updating
//         });
//         res.status(200).send('User updated successfully');
//     } catch (err){
//         res.status(400).send('Update Failed'+ err.message);
//     }
// });