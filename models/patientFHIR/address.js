const period = require('./common/period');

const address = {
    use:        { type: String,
        //  enum: ['home', 'work', 'temp', 'old', 'billing']
        }, 
    type:       { type: String, 
        // enum: ['postal', 'physical', 'both']
}, 
    text:       String,
    line:       [String],
    city:       String,
    district:   String,
    state:      String,
    postalCode: String,
    country:    String,
    period:     period.period
};

module.exports = {address};