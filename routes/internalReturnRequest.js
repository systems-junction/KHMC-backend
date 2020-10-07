const express = require('express');
const {
    getInternalReturnRequestsBU,
    getInternalReturnRequestsFU,
    getInternalReturnRequestsFUByKeyword,
    getInternalReturnRequestsById,
    deleteInternalReturnRequests,
    addInternalReturnRequest,
    updateInternalRequest
} = require('../controllers/internalReturnRequest');

const router = express.Router();
router.get('/getinternalreturnrequestsbu', getInternalReturnRequestsBU);
router.get('/getinternalreturnrequestsfu', getInternalReturnRequestsFU);
router.get('/getinternalreturnrequestsfu/:keyword', getInternalReturnRequestsFUByKeyword);
router.get('/getinternalreturnrequest/:_id', getInternalReturnRequestsById);
router.delete('/deleteinternalreturnrequest/:_id', deleteInternalReturnRequests);
router.post('/addinternalreturnrequest', addInternalReturnRequest);
router.put('/updateinternalrequest', updateInternalRequest);

module.exports = router;
