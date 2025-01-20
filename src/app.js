const express = require('express');

const app = express();

app.get('/getUserData', (req, res)=> {
    throw new Error('sample error');
    // try{
    //     throw new Error('sample error');
    // } catch(err){
    //     res.status(500).send('something went wrong');
    // }
});

app.use('/', (err, req, res, next) => {
    if (err) {
        //Note: better approach is to throw an error mentioned above
        res.status(500).send('something went wrong last');
    }
})

app.listen(3000, () => {
    console.log('listening on port 3000');
});