const mongoose = require('mongoose');
const { Schema } = mongoose;

const connectionRequestSchema = new Schema({
    fromUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: 'string',
        enum: {
            values: ['ignored', 'interested', 'accepted', 'rejected'],
            message: '{VALUE} is incorrect status type',
        },
        required: true,
    },
}, {
    timestamps: true,
});

//Here we are setting the index in the form of compound index(Which means the combination of 2 fields)
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//'pre' will be called before the save connection request invoked
connectionRequestSchema.pre('save', function(next) {
    const connectionRequest = this;
    const { fromUserId= null, toUserId= null } = connectionRequest;
    // check if fromUserId is same as toUserId
    if (fromUserId.equals(toUserId)) {
        throw new Error('Cannot send connection request to yourself');
    }
    next();
});

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);