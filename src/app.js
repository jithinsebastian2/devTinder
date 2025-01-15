const express = require('express');

const app = express();

app.use('/test', (req, res)=>{
    res.send('Hello from test');
});

app.use('/hello', (req, res)=>{
    res.send('Response from hello route');
});

app.use('/', (req, res)=>{
    res.send('Hello from server');
});

app.listen(3000, () => {
    console.log('listening on port 3000');
});