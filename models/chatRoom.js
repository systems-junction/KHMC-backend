const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    participant1:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
    },
    participant2:{
    type: mongoose.Schema.ObjectId,
    ref:'User'
    },
    chat:[
        {
            message: {
            type: String
            },
            msgType: {
                type: String,
                default: ""
            },
            sender: {
            type: mongoose.Schema.ObjectId,
            ref:'User'
            },
            receiver:{
            type: mongoose.Schema.ObjectId,
            ref:'User'
            },
            read:{
                type:Boolean,
                default:false
            },
            sentAt:{
                type: Date,
                default: Date.now               
            },        
        }
    ]
});

module.exports = mongoose.model('chatroom', chatSchema);


 

