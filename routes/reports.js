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
    acmDashboard,
    purchasingOfficerDashboard,
    whikDashboard,
    fuikDashboard,
    cashierDashboard,
    icmDashboard,
    rtDashboard,
    ltDashboard,
    pharmacistDashboard,
    // consultantDashboard,
    // doctorDashboard,
    nurseDashboard,
    roDashboard
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
router.get('/acmdashboard', acmDashboard);
router.get('/purchasingofficerdashboard', purchasingOfficerDashboard);
router.get('/whikdashboard', whikDashboard);
router.get('/fuikdashboard', fuikDashboard);
router.get('/cashierdashboard', cashierDashboard);
router.get('/icmdashboard', icmDashboard);
router.get('/rtdashboard', rtDashboard);
router.get('/ltdashboard', ltDashboard);
router.get('/pharmacistdashboard', pharmacistDashboard);
// router.get('/consultantdashboard', consultantDashboard);
// router.get('/doctordashboard', doctorDashboard);
router.get('/nursedashboard', nurseDashboard);
router.get('/rodashboard', roDashboard);
module.exports = router;
