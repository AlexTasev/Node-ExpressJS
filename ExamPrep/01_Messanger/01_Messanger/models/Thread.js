let mongoose = require('mongoose');

let threadSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    dataCreated: {
        type: mongoose.Schema.Types.Date,
        default: Date.now
    }
});

const Thread = mongoose.model('Thread', threadSchema);

module.exports = Thread;