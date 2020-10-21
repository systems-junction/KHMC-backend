const express = require('express');
const {
    trackingPO,
    trackingPOCount,
    stockLevelsWH,
    stockLevelsFU,
    supplierFulfillmentPO
} = require('../controllers/reports');

const router = express.Router();

router.post('/trackingpo/:status',trackingPO);
router.post('/trackingpocount/:status',trackingPOCount);
router.post('/stocklevelswh',stockLevelsWH)
router.post('/stocklevelsfu',stockLevelsFU)
router.post('/supplierfulfillmentpo',supplierFulfillmentPO)
module.exports = router;
