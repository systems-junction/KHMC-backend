const express = require('express');
const {
    getSystemAdmin,
    addSystemAdmin,
    deleteSystemAdmin,
    updateSystemAdmin
} = require('../controllers/systemAdmin');

const router = express.Router();


router.get('/getsystemadmin', getSystemAdmin);
router.post('/addsystemadmin', addSystemAdmin);
router.delete('/deletesystemadmin/:_id', deleteSystemAdmin);
router.put('/updatesystemadmin', updateSystemAdmin);

module.exports = router;
