const express = require('express');
const {
    getStaffType,
    addStaffType,
    deleteStaffType,
    updateStaffType
} = require('../controllers/staffType');

const router = express.Router();


router.get('/getstafftype', getStaffType);
router.post('/addstafftype', addStaffType);
router.delete('/deletestafftype/:_id', deleteStaffType);
router.put('/updatestafftype', updateStaffType);

module.exports = router;
