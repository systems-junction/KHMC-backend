const mongoose = require('mongoose');

const icd10CodesSchema = new mongoose.Schema({
    procedureCodeCategory:{
        type:String
    },	
    icd10PCSCodes:{
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

module.exports = mongoose.model('icd10Codes', icd10CodesSchema);
