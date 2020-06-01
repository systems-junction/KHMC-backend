const express = require('express');
const {
    getBuRepRequestDetails,
    addBuRepRequestDetails,
    deleteBuRepRequestDetails,
    updateBuRepRequestDetails
} = require('../controllers/buRepRequestDetails');

const router = express.Router();


router.get('/getbureprequestdetails', getBuRepRequestDetails);
router.post('/addbureprequestdetails', addBuRepRequestDetails);
router.delete('/deletebureprequestdetails/:_id', deleteBuRepRequestDetails);
router.put('/updatebureprequestdetails', updateBuRepRequestDetails);

module.exports = router;