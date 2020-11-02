const period = require('./common/period');

const contactPoint = {
    system: { type: String, 
        // enum: ['phone', 'fax', 'email', 'pager', 'url', 'sms', 'other'], 
        // required: true 
    },
    value:  { type: String
        // , unique: true 
    },
    use:    { type: String, 
        // enum: ['home', 'work', 'temp', 'old', 'mobile'],
    //  required: true 
    },
    rank:   Number,
    period: period.period,
};
module.exports = { contactPoint };