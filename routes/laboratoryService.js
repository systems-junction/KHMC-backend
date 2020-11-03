const express = require('express');

const {
    getLaboratoryService,
    addLaboratoryService,
    deleteLaboratoryService,
    updateLaboratoryService,
    getSearchedLabs
} = require('../controllers/laboratoryService');

const router = express.Router();

router.get('/getlaboratoryservice', getLaboratoryService);
router.post('/addlaboratoryservice', addLaboratoryService);
router.delete('/deletelaboratoryservice/:_id', deleteLaboratoryService);
router.put('/updatelaboratoryservice', updateLaboratoryService);
router.get('/getsearchedlabs/:keyword', getSearchedLabs);

module.exports = router;
