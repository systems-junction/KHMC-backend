const express = require('express');
const {
    getBuStockOutLog,
    addBuStockOutLog,
    deleteBuStockOutLog,
    updateBuStockOutLog
} = require('../controllers/buStockOutLog');

const router = express.Router();


router.get('/getbustockoutlog', getBuStockOutLog);
router.post('/addbustockoutlog', addBuStockOutLog);
router.delete('/deletebustockoutlog/:_id', deleteBuStockOutLog);
router.put('/updatebustockoutlog', updateBuStockOutLog);

module.exports = router;