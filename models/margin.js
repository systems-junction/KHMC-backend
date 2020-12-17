const mongoose = require('mongoose');

const marginSchema = new mongoose.Schema({
    wtf:{
        type:Number
    },
    ftp:{
        type:Number
    },
    date: {
        type:Date,
        default: Date.now
    }
});

module.exports = mongoose.model('margin', marginSchema);
