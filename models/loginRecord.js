const mongoose = require('mongoose');

const loginRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },
    session: [{
        token: {
            type: String
        },
        login: {
            type: Date,
        },
        logout: {
            type: Date,
        },
    }]

});

module.exports = mongoose.model('loginRecord', loginRecordSchema);
