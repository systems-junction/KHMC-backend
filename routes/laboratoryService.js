const express = require('express');

const {
    getLaboratoryService,
    addLaboratoryService,
    deleteLaboratoryService,
    updateLaboratoryService,
} = require('../controllers/laboratoryService');

const router = express.Router();

router.get('/getlaboratoryservice', getLaboratoryService);
router.post('/addlaboratoryservice', addLaboratoryService);
router.delete('/deletelaboratoryservice/:_id', deleteLaboratoryService);
router.put('/updatelaboratoryservice', updateLaboratoryService);

module.exports = router;
