const express = require('express');

const app = express();

app.use(
    '/user',
    (req, res, next)=> {
        console.log('handling the route user');
        // res.send('first response');
        next();
    },
    (req, res, next)=> {
        console.log('handling the route user1');
        // res.send('first response');
        next();
    },
    (req, res, next)=> {
        console.log('handling the route user2');
        // res.send('first response');
        next();
    },
    (req, res, next)=> {
        console.log('handling the route user3');
        res.send('last response');
    }
)

app.listen(3000, () => {
    console.log('listening on port 3000');
});