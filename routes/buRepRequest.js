const express = require('express');
const {
    getBuRepRequest,
    addBuRepRequest,
    deleteBuRepRequest,
    updateBuRepRequest
} = require('../controllers/buRepRequest');

const router = express.Router();


router.get('/getbureprequest', getBuRepRequest);
router.post('/addbureprequest', addBuRepRequest);
router.delete('/deletebureprequest/:_id', deleteBuRepRequest);
router.put('/updatebureprequest', updateBuRepRequest);

module.exports = router;