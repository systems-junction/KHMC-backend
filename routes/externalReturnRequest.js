const express = require('express');
const {
    getExternalReturnRequests,
    getExternalReturnRequestsById,
    deleteExternalReturnRequests,
    addExternalReturnRequest,
    updateExternalRequest
} = require('../controllers/externalReturnRequest');

const router = express.Router();
router.get('/getexternalreturnrequests', getExternalReturnRequests);
router.get('/getexternalreturnrequest/:_id', getExternalReturnRequestsById);
router.delete('/deleteexternalreturnrequest/:_id', deleteExternalReturnRequests);
router.post('/addexternalreturnrequest', addExternalReturnRequest);
router.put('/updateexternalrequest', updateExternalRequest);

module.exports = router;
