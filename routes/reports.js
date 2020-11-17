const express = require('express');
const {
    trackingPO,
    trackingPOCount,
    stockLevelsWH,
    stockLevelsFU,
    supplierFulfillmentPO,
    expiredItemsWH,
    expiredItemsFU,
    nearlyExpiredItemsWH,
    nearlyExpiredItemsFU,
    prpoDashboard
} = require('../controllers/reports');

const router = express.Router();

router.post('/trackingpo/:status',trackingPO);
router.post('/trackingpocount/:status',trackingPOCount);
router.post('/stocklevelswh',stockLevelsWH)
router.post('/stocklevelsfu/:id',stockLevelsFU)
router.post('/supplierfulfillmentpo',supplierFulfillmentPO)
router.get('/expireditemswarehouse',expiredItemsWH)
router.get('/expireditemsfunctionalunit/:id',expiredItemsFU)
router.post('/nearlyexpireditemswarehouse/:id',nearlyExpiredItemsWH)
router.post('/nearlyexpireditemsfunctionalunit/:id',nearlyExpiredItemsFU)
router.get('/prdashboard', prpoDashboard);
module.exports = router;
