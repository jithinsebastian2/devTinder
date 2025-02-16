const express = require('express');

const requestRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

requestRouter.post('/request/send/:status/:toUserId',
    userAuth, async (req, res)=> {
    try {
        const fromUserId = req?.user?._id;
        const toUserId = req?.params?.toUserId;
        const status = req?.params?.status;
        console.log('fromUserId', fromUserId, toUserId);

        const allowedStatus = ['interested', 'ignored'];
        const toUser = await User.findById(toUserId);

        if (!allowedStatus.includes(status)) {
            throw new Error('Incorrect status type: ' + status);
        }
        // if (fromUserId === toUserId) { //To do: not working yet
        //     throw new Error('Sender and receiver could not be same');
        // }
        if (!toUser) {
            throw new Error('User not exists ');
        }
        // If there is an existing connection request
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId },
            ]
        });
        if (existingConnectionRequest) {
            throw new Error('Connection request already exists');
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
        const data = await connectionRequest.save();
        res.status(200).json({
            status: 'success',
            message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
            data,
        });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
});

module.exports = requestRouter;