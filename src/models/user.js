const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        index: true, // For creating an index or unique identifier, mongoDb will create it for us
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
        validate(value) { // This kind of methods are called schema methods
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
        enum: {
            values: ['male', 'female', 'other'],
            message: '{VALUE} is not a valid gender type',
        },
        // validate(value) {
        //     if (!['male', 'female', 'others'].includes(value)) {
        //         throw new Error('Gender data is not valid');
        //     }
        // }
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


// We can create index for multiple fields
// Compound indexes collect and sort data from two or more fields in each document in a collection.
userSchema.index({ firstName: 1, lastName: 1 });

userSchema.methods.getJWT = async function() {
    const user = this;
     const token = await jwt.sign(
        { _id: user._id },
        "DEV@Tinder$790", //This portion is secret key(eg: DEV@Tinder$790)
        {
            expiresIn:'1d' // Expiry date for the Token
        }
    );
    return token;
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    console.log('passwordHash', passwordInputByUser, passwordHash);
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
};

module.exports = mongoose.model('User', userSchema);