const express = require('express');
const {
    getReplenishmentRequestsBU,
    getReplenishmentRequestsBUM,
    getReplenishmentRequestsBUMKeyword,
    getReplenishmentRequestsBUNM,
    getReplenishmentRequestsByIdBU,
    addReplenishmentRequestBU,
    deleteReplenishmentRequestBU,
    updateReplenishmentRequestBU,
    getCurrentItemQuantityBU
} = require('../controllers/replenishmentRequestBU');

const router = express.Router();

router.post('/getcurrentitemquantitybu', getCurrentItemQuantityBU);
router.get('/getreplenishmentrequestsbu', getReplenishmentRequestsBU);
router.get('/getreplenishmentrequestsbup', getReplenishmentRequestsBUM);
router.get('/getreplenishmentrequestsbup/:keyword', getReplenishmentRequestsBUMKeyword);
router.get('/getreplenishmentrequestsbunp', getReplenishmentRequestsBUNM);
router.get('/getreplenishmentrequestsbu/:_id', getReplenishmentRequestsByIdBU);
router.post('/addreplenishmentrequestbu', addReplenishmentRequestBU);
router.delete('/deletereplenishmentrequestbu/:_id', deleteReplenishmentRequestBU);
router.put('/updatereplenishmentrequestbu', updateReplenishmentRequestBU);

module.exports = router;
