const express = require('express');
const {
    getBuStockInLog,
    addBuStockInLog,
    deleteBuStockInLog,
    updateBuStockInLog
} = require('../controllers/buStockInLog');

const router = express.Router();


router.get('/getbustockinlog', getBuStockInLog);
router.post('/addbustockinlog', addBuStockInLog);
router.delete('/deletebustockinlog/:_id', deleteBuStockInLog);
router.put('/updatebustockinlog', updateBuStockInLog);

module.exports = router;