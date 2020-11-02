const express = require('express');

const {
    getSurgeryService,
    addSurgeryService,
    deleteSurgeryService,
    updateSurgeryService,
    getSearchedSurgery
} = require('../controllers/surgeryService');

const router = express.Router();

router.get('/getsurgeryservice', getSurgeryService);
router.post('/addsurgeryservice', addSurgeryService);
router.delete('/deletesurgeryservice/:_id', deleteSurgeryService);
router.put('/updatesurgeryservice', updateSurgeryService);
router.get('/getsearchedsurgery/:keyword', getSearchedSurgery);
module.exports = router;
