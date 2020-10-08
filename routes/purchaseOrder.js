const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getPurchaseOrder,
    getPurchaseOrders,
    getPurchaseOrdersKeyword,
    addPurchaseOrder,
    deletePurchaseOrder,
    updatePurchaseOrder,
} = require('../controllers/purchaseOrder');

const router = express.Router();

router.get('/getpurchaseorder', getPurchaseOrder);
router.get('/getpurchaseorders', getPurchaseOrders);
router.get('/getpurchaseorders/:keyword', getPurchaseOrdersKeyword);
router.post('/addpurchaseorder', validateParams([
    {
        param_key: 'generated',
        required: true,
        type: 'string'
    },
    {
        param_key: 'date',
        required: true,
        type: 'string'
    },
    {
        param_key: 'vendorId',
        required: true,
        type: 'string'
    },
    {
        param_key: 'status',
        required: true,
        type: 'string'
    }
  ]), addPurchaseOrder);

router.delete('/deletepurchaseorder/:_id', deletePurchaseOrder);
router.put('/updatepurchaseorder', updatePurchaseOrder);

module.exports = router;
