const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getPurchaseRequests,
    addPurchaseRequest,
    deletePurchaseRequest,
    updatePurchaseRequest,
    getPurchaseRequestVendors,
    getCurrentItemQuantity
} = require('../controllers/purchaseRequest');
const router = express.Router();
router.get('/getprvendor/:_id',getPurchaseRequestVendors)
router.get('/getcurrqty/:_id',getCurrentItemQuantity)
router.get('/getpurchaserequests', getPurchaseRequests);
router.post('/addpurchaserequest', validateParams([
    {
        param_key: 'generatedBy',
        required: true,
        type: 'string'
    },
    {
        param_key: 'status',
        required: true,
        type: 'string'
    }
  ]), addPurchaseRequest);


router.delete('/deletepurchaserequest/:_id', deletePurchaseRequest);
router.put('/updatepurchaserequest', updatePurchaseRequest);
module.exports = router;
