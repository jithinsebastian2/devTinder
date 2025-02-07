const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email'+ value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error('Invalid password is not strong'+ value);
            }
        }
    },
    age: {
        type: Number,
        min: 18
    },
    gender: {
        type: String,
        validate(value) {
            if (!['male', 'female', 'others'].includes(value)) {
                throw new Error('Gender data is not valid');
            }
        }
    },
    photoUrl: {
        type: String,
        default: '',
        validate(value) {
            console.log('photoUrl', value);
            if (!validator.isURL(value)) {
                throw new Error('Invalid photo url'+ value);
            }
        }
    },
    about: {
        type: String,
        default: 'This is a default about for the user'
    },
    skills: {
        type: [String],
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', userSchema);