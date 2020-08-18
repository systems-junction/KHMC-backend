const mongoose  = require('mongoose');
const period = require('./common/period');
const address = require('./address');
const contact = {
    relationship:[{type:String}],
        name:{type:String},
        telecom:[telecom.contactPoint],
        address:address.address,
        gender:{type:String},
        organization:{type:mongoose.Schema.ObjectId},
        period:period.period
      };

module.exports = {contact};