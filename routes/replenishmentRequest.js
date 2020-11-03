const express = require('express');
const {
    getReplenishmentRequestsFU,
    getReplenishmentRequestsFUByKeyword,
    getReplenishmentRequestsByIdFU,
    // getReplenishmentRequestsBU,
    // getReplenishmentRequestsByIdBU,
    addReplenishmentRequest,
    deleteReplenishmentRequest,
    updateReplenishmentRequest,
    getCurrentItemQuantityFU,
    // getCurrentItemQuantityBU
} = require('../controllers/replenishmentRequest');

const router = express.Router();

router.post('/getcurrentitemquantityfu', getCurrentItemQuantityFU);
// router.post('/getcurrentitemquantitybu', getCurrentItemQuantityBU);
router.get('/getreplenishmentrequestsFU', getReplenishmentRequestsFU);
router.get('/getreplenishmentrequests/:keyword', getReplenishmentRequestsFUByKeyword);
router.get('/getreplenishmentrequestsFU/:_id', getReplenishmentRequestsByIdFU);
// router.get('/getreplenishmentrequestsBU', getReplenishmentRequestsBU);
// router.get('/getreplenishmentrequestsBU/:_id', getReplenishmentRequestsByIdBU);
router.post('/addreplenishmentrequest', addReplenishmentRequest);
router.delete('/deletereplenishmentrequest/:_id', deleteReplenishmentRequest);
router.put('/updatereplenishmentrequest', updateReplenishmentRequest);

module.exports = router;
