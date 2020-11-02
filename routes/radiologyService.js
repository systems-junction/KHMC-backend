const express = require('express');

const {
    getRadiologyService,
    addRadiologyService,
    deleteRadiologyService,
    updateRadiologyService,
    getSearchedRadiology
} = require('../controllers/radiologyService');

const router = express.Router();

router.get('/getradiologyservice', getRadiologyService);
router.post('/addradiologyservice', addRadiologyService);
router.delete('/deleteradiologyservice/:_id', deleteRadiologyService);
router.put('/updateradiologyservice', updateRadiologyService);
// router.put('/updateradiologyservice', updateRadiologyService);
router.get('/getsearchedradiology/:keyword', getSearchedRadiology);
module.exports = router;
