const express = require('express');
const {
    getStaff,
    addStaff,
    deleteStaff,
    getExternalConsultant,
    updateStaff
} = require('../controllers/staff');

const router = express.Router();


router.get('/getstaff', getStaff);
router.get('/getexternalconsultant', getExternalConsultant);
router.post('/addstaff', addStaff);
router.delete('/deletestaff/:_id', deleteStaff);
router.put('/updatestaff', updateStaff);

module.exports = router;
