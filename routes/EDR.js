const express = require('express');

const {
    getEDR,
    getEDRById,
    addEDR,
    deleteEDR,
    updateEDR
} = require('../controllers/EDR');

const router = express.Router();
router.get('/getedr/:_id', getEDRById);
router.get('/getedr', getEDR);
router.post('/addedr', addEDR);
router.delete('/deleteedr/:_id', deleteEDR);
router.put('/updateedr', updateEDR);

module.exports = router;
