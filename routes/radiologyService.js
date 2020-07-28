const express = require('express');

const {
    getRadiologyService,
    addRadiologyService,
    deleteRadiologyService,
    updateRadiologyService,
} = require('../controllers/radiologyService');

const router = express.Router();

router.get('/getradiologyservice', getRadiologyService);
router.post('/addradiologyservice', addRadiologyService);
router.delete('/deleteradiologyservice/:_id', deleteRadiologyService);
router.put('/updateradiologyservice', updateRadiologyService);
// router.put('/updateradiologyservice', updateRadiologyService);
module.exports = router;
