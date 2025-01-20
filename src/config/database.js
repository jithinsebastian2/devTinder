const mongoose = require('mongoose');

const connectDB = async() => {
    //Here we are connecting to NamasteNode cluster and devTinder database inside that cluster
    await mongoose.connect('mongodb+srv://jithinsebastian93:jeep1234@namastenode.iluo8.mongodb.net/devTinder');
};

module.exports = connectDB;

