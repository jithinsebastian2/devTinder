const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

const userRouter = express.Router();

const USER_SAFE_DATA = 'firstName lastName photoUrl age gender about skills';

// Get all the pending connection requests for the loggedIn user
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: 'interested',
        }).populate('fromUserId', USER_SAFE_DATA);
        // }).populate('fromUserId', ['firstName', 'lastName', 'photoUrl', 'about', 'skills']);

        res.status(200).json({
            status:'success',
            message: 'Received connection requests',
            data: connectionRequest,
        });
    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: 'accepted' },
                { toUserId: loggedInUser._id, status: 'accepted' },
            ],
        }).populate('fromUserId', USER_SAFE_DATA)
        .populate('toUserId', USER_SAFE_DATA);

        const data = connectionRequests.map(row=> {
            if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return  row.fromUserId;
        });

        res.status(200).json({
            status: 'success',
            message: 'Accepted Connections fetched',
            data,
        });

    } catch (err) {
        res.status(400).send('Error: ' + err.message);
    }
});

userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query?.page) || 1;
        let limit = parseInt(req.query?.limit) || 10;
        limit = limit > 50 ?  50 : limit;
        const skip = (page - 1) * limit;
    
        const connectionRequests = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }]
        });

        const hideUsersFromFeed = new Set(); // Set is similar to Array, but won't allow duplication of values.
        connectionRequests.forEach(request => {
            hideUsersFromFeed.add(request.fromUserId._id.toString());
            hideUsersFromFeed.add(request.toUserId._id.toString());
        });

        /**
         * Conditions:
         * 1. Hide users from the feed whoever already accepted, rejected, received request
         * 2. Hide own user card from the feed
         */
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUsersFromFeed) } },
                { _id: { $ne: loggedInUser._id }}
            ]
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.status(200).json({
            status: 'success',
            message: 'Feed fetched',
            data: users,
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// To do: Enhancements:
/**
 * 1. Try to modify the feed api based on the people with similar skill sets[Eg: javascript], age, gender etc.
 */

module.exports = userRouter;