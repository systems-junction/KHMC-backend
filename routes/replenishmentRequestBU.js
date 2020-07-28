const express = require('express');
const {
    getReplenishmentRequestsBU,
    getReplenishmentRequestsBUP,
    getReplenishmentRequestsBUNP,
    getReplenishmentRequestsByIdBU,
    addReplenishmentRequestBU,
    deleteReplenishmentRequestBU,
    updateReplenishmentRequestBU,
    getCurrentItemQuantityBU
} = require('../controllers/replenishmentRequestBU');

const router = express.Router();

router.post('/getcurrentitemquantitybu', getCurrentItemQuantityBU);
router.get('/getreplenishmentrequestsbu', getReplenishmentRequestsBU);
router.get('/getreplenishmentrequestsbup', getReplenishmentRequestsBUP);
router.get('/getreplenishmentrequestsbunp', getReplenishmentRequestsBUNP);
router.get('/getreplenishmentrequestsbu/:_id', getReplenishmentRequestsByIdBU);
router.post('/addreplenishmentrequestbu', addReplenishmentRequestBU);
router.delete('/deletereplenishmentrequestbu/:_id', deleteReplenishmentRequestBU);
router.put('/updatereplenishmentrequestbu', updateReplenishmentRequestBU);

module.exports = router;
