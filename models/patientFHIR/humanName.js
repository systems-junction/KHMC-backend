const humanName = {
    use:    {type: String,
        // enum: ['USUAL', 'OFFICIAL', 'TEMP', 'NICKNAME', 'ANONYMOUS', 'OLD', 'MAIDEN']
    },
    text:   String,
    family: String,
    given:  [{type:String}],
    prefix: String,
    suffix: [{type:String}],
    period: {start: Date,end: Date}
}

module.exports = {humanName}