const LoginRecord = require('../models/loginRecord');
const asyncHandler = require('../middleware/async');

exports.createRecord = asyncHandler(async (req, res) => {
    const checkRecord = await LoginRecord.findOne({
        userId: { $in: [req.body.userId] }
    })
    if (checkRecord) {
        res.status(200).json({ success: true, data: checkRecord })
    }
    else {
        const {
            userId,
            login,
            logout,
            token
        } = req.body;
        const Record = await LoginRecord.create({
            userId
        })
        res.status(200).json({ success: true, data: Record });
    }

});