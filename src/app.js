const express = require('express');

const app = express();

//This will only handle GET requests to /user route on this server
app.get('/user', (req, res) => {
    res.send({
        firstName: 'Jithin',
        lastName: 'Sebastian',
        email: 'jithinsebastian93@gmail.com',
    })
});

app.post('/user', (req, res) => {
    res.send('Data saved successfully the the DB');
});

app.delete('/user', (req, res) => {
    res.send('Data deleted successfully the the DB');
});

// This will match all the HTTP method API calls to /test
app.use('/test', (req, res)=>{
    res.send('Hello from test');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});