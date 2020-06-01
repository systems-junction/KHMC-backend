const express = require('express');
const {
    getStaff,
    addStaff,
    deleteStaff,
    updateStaff
} = require('../controllers/staff');

const router = express.Router();


router.get('/getstaff', getStaff);
router.post('/addstaff', addStaff);
router.delete('/deletestaff/:_id', deleteStaff);
router.put('/updatestaff', updateStaff);

module.exports = router;
