const mongoose = require('mongoose');
const notificationSchema = new mongoose.Schema(
{
    title:{
    type:String
    },
    message:{
    type:String
    },
    sendTo:[
    {    
    userId:{
    type:mongoose.Schema.ObjectId,
    ref:"User"
    },
    read:{
    type:Boolean,
    default:false
    }
    }],
    date:{
    type:Date,
    default: Date.now
    }
});
module.exports = mongoose.model('notification', notificationSchema);