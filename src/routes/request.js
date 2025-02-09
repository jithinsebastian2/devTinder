const express = require('express');

const requestRouter = express.Router();
const { userAuth } = require('../middlewares/auth');

requestRouter.post('/sendConnectionRequest', userAuth, async (req, res)=> {
    res.status(200).send(`${req?.user?.firstName} send the connection request`);
});

module.exports = requestRouter;