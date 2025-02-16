const express = require('express');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData, validateResetPassword } = require('../utils/validation');

profileRouter.get('/profile/view', userAuth, async (req, res)=> {
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

profileRouter.patch('/profile/edit', userAuth, async (req, res)=> {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error('Invalid Edit request');
        }
        const loggedInUser = req.user;
        const reqUserBody = req.body;
        Object.keys(reqUserBody).forEach((field)=> {
            loggedInUser[field] = reqUserBody[field];
        });
        await loggedInUser.save();

        res.status(200).json({
            status: 'success',
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser,
        });
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

// Forgot password API
profileRouter.patch('/profile/password', async (req, res)=> {
    try {
        const { emailId = '', password = '', newPassword = '' } = req?.body;
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error('Invalid emailId');
        }
        validateResetPassword(password, newPassword);
        const isPasswordValid = await user.validatePassword(password);
        if (isPasswordValid) {
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
            res.status(200).json({
                status: 'success',
                message: `${user.firstName}, you password has reset successfully`,
            });
        } else {
            throw new Error('Current password is invalid');
        }
    } catch (err) {
        res.status(400).send('ERROR: ' + err.message);
    }
});

module.exports = profileRouter;