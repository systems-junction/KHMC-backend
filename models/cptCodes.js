const mongoose = require('mongoose');

const cptCodesSchema = new mongoose.Schema({
    procedureCodeCategory:{
        type:String
    },	
    cptCodes:{
        type:String
    },	
    procedureCodeDescriptions:{
        type:String
    },	
    status:{
        type:String
    },    
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('cptCodes', cptCodesSchema);
