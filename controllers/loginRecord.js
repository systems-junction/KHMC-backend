const LoginRecord = require('../models/loginRecord');
var moment = require('moment');
const asyncHandler = require('../middleware/async');

exports.createRecord = asyncHandler(async (req, res) => {
    var todayDate = moment().utc().toDate();
    const checkRecord = await LoginRecord.findOne({userId:req.body.userId })
    if (checkRecord) {
        var arr = [{
            token:req.body.token,
            login:todayDate,
            logout:""
            }]
        await LoginRecord.findOneAndUpdate({userId:req.body.userId},
            {$push:{session:arr}}
            )
        res.status(200).json({ success: true, data: checkRecord })
    }
    else {
        var session = [
            {
                token:req.body.token,
                login:todayDate,
                logout:""
            }
        ]
        const Record = await LoginRecord.create({
            userId:req.body.userId,
            session:session
        })
        res.status(200).json({ success: true, data: Record });
    }

});

exports.recordLogout = asyncHandler(async (req, res) => {
    var logoutTime = moment().utc().toDate(); 
    var Record = await LoginRecord.findOneAndUpdate({userId:req.body.userId,'session.token':req.body.token},
                {$set:{'session.$.logout':logoutTime}})
    res.status(200).json({ success: true, data: Record })
 
});