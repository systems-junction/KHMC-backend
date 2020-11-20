const express = require('express');
const {
    getStaff,
    updateSuper,
    updateNurse,
    addStaff,
    deleteStaff,
    getExternalConsultant,
    getExternalConsultantName,
    updateStaff
} = require('../controllers/staff');

const router = express.Router();


router.get('/getstaff', getStaff);
router.get('/updatesuper', updateSuper);
router.get('/updatenurse', updateNurse);
router.get('/getexternalconsultant', getExternalConsultant);
router.get('/getexternalconsultantname', getExternalConsultantName);
router.post('/addstaff', addStaff);
router.delete('/deletestaff/:_id', deleteStaff);
router.put('/updatestaff', updateStaff);
module.exports = router;
