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
    disposedItems,
    consumptionBalance,
    slowMovingWH,
    slowMovingFU,
    whTransfer,
    acmDashboard,
    purchasingOfficerDashboard,
    whikDashboard,
    fuikDashboard,
    cashierDashboard,
    icmDashboard,
    rtDashboard,
    ltDashboard,
    pharmacistDashboard,
    consultantDashboard,
    doctorDashboard,
    nurseDashboard,
    roDashboard
} = require('../controllers/reports');

const router = express.Router();

router.post('/trackingpo/:status',trackingPO);
router.post('/trackingpocount/:status',trackingPOCount);
router.post('/stocklevelswh',stockLevelsWH)
router.post('/stocklevelsfu/:id',stockLevelsFU)
router.post('/supplierfulfillmentpo',supplierFulfillmentPO)
router.post('/expireditemswh',expiredItemsWH)
router.post('/expireditemsfu/:id',expiredItemsFU)
router.post('/nearlyexpireditemswh',nearlyExpiredItemsWH)
router.post('/nearlyexpireditemsfu/:id',nearlyExpiredItemsFU)
router.post('/disposeditems/:id',disposedItems)
router.post('/consumptionbalance',consumptionBalance)
router.post('/slowmovingwh',slowMovingWH)
router.post('/slowmovingfu/:id',slowMovingFU)
router.post('/whtransfer/:id',whTransfer)
//dashboard
router.get('/acmdashboard', acmDashboard);
router.get('/purchasingofficerdashboard', purchasingOfficerDashboard);
router.get('/whikdashboard', whikDashboard);
router.get('/fuikdashboard/:id', fuikDashboard);
router.get('/cashierdashboard', cashierDashboard);
router.get('/icmdashboard', icmDashboard);
router.get('/rtdashboard', rtDashboard);
router.get('/ltdashboard', ltDashboard);
router.get('/pharmacistdashboard', pharmacistDashboard);
router.get('/consultantdashboard/:id', consultantDashboard);
router.get('/doctordashboard/:id', doctorDashboard);
router.get('/nursedashboard', nurseDashboard);
router.get('/rodashboard', roDashboard);
module.exports = router;
