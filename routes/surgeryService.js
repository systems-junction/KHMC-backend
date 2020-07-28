const express = require('express');

const {
    getSurgeryService,
    addSurgeryService,
    deleteSurgeryService,
    updateSurgeryService,
} = require('../controllers/surgeryService');

const router = express.Router();

router.get('/getsurgeryservice', getSurgeryService);
router.post('/addsurgeryservice', addSurgeryService);
router.delete('/deletesurgeryservice/:_id', deleteSurgeryService);
router.put('/updatesurgeryservice', updateSurgeryService);

module.exports = router;
