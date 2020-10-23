const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    message: {
    type: String
    },
    sender: {
    type: mongoose.Schema.ObjectId,
    ref:'User'
    },
    receiver:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
    }        
});

module.exports = mongoose.model('chat', chatSchema);


 

