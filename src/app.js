const express = require('express');

const app = express();

//This will only handle GET requests to /user route on this server
app.get('/user/:userId/:name/:password', (req, res) => {
    console.log("Query params", req.query);
    console.log('Path params', req.params);
    res.send({
        firstName: 'Jithin',
        lastName: 'Sebastian'
    })
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});