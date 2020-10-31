const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getFUById,
    getWithBU,
    getFunctionalUnits,
    getFunctionalUnitLogs,
    addFunctionalUnit,
    deleteFunctionalUnit,
    updateFunctionalUnit,
    getHead
} = require('../controllers/functionalUnit');

const router = express.Router();
router.get('/getfubyid/:_id', getFUById);
router.get('/getwithbu/:_id', getWithBU);
router.get('/gethead/:_id', getHead);
router.get('/getfunctionalunits', getFunctionalUnits);
router.get('/getfunctionalunitlogs/:_id', getFunctionalUnitLogs);
router.post('/addfunctionalunit', validateParams([
    {
        param_key: 'fuName',
        required: true,
        type: 'string'
    },
    {
        param_key: 'description',
        required: true,
        type: 'string'
    },
    {
        param_key: 'fuHead',
        required: true,
        type: 'string'
    },
    {
        param_key: 'buId',
        required: true,
        type: 'string'
    },
    {
        param_key: 'status',
        required: true,
        type: 'string'
    },
    {
        param_key: 'updatedBy',
        required: true,
        type: 'string'
    },
  ]), addFunctionalUnit);
router.delete('/deletefunctionalunit/:_id', deleteFunctionalUnit);
router.put('/updatefunctionalunit', updateFunctionalUnit);

module.exports = router;
