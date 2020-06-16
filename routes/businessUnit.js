const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getBusinessUnit,
    getBusinessUnitLogs,
    addBusinessUnit,
    deleteBusinessUnit,
    updateBusinessUnit,
    getHead
} = require('../controllers/businessUnit');

const router = express.Router();

router.get('/gethead/:_id', getHead);
router.get('/getbusinessunit', getBusinessUnit);
router.get('/getbusinessunitlogs/:_id', getBusinessUnitLogs);
router.post('/addbusinessunit', validateParams([
    {
        param_key: 'buName',
        required: true,
        type: 'string'
    },
    {
        param_key: 'description',
        required: true,
        type: 'string'
    },
    {
        param_key: 'buHead',
        required: true,
        type: 'string'
    },
    {
        param_key: 'updatedBy',
        required: true,
        type: 'string'
    },
    {
        param_key: 'status',
        required: true,
        type: 'string'
    }
]),addBusinessUnit);
router.delete('/deletebusinessunit/:_id', deleteBusinessUnit);
router.put('/updatebusinessunit', updateBusinessUnit);

module.exports = router;