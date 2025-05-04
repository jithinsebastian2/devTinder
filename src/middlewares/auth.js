
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        // Read the token from the request
        const { token = null } = req.cookies || {};
        if (!token) {
            return res.status(401).send('Please login');
        }

        // validate the token
        const decodedObj = await jwt.verify(token, "DEV@Tinder$790");
        const { _id } = decodedObj;

        // Find the user
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }
        console.log('user***', user);
        req.user = user;
        next();
    } catch(err){
        res.status(400).send('Error: ' + err.message)
    }
};

module.exports = {
    userAuth,
};