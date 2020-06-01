const express = require('express');
const {
    getWPODetails,
    addWPODetails,
    deleteWPODetails,
    updateWPODetails
} = require('../controllers/wPODetails');

const router = express.Router();


router.get('/getwpodetails', getWPODetails);
router.post('/addwpodetails', addWPODetails);
router.delete('/deletewpodetails', deleteWPODetails);
router.put('/updatewpodetails', updateWPODetails);

module.exports = router;
