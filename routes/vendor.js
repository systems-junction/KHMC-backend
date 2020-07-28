const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getVendors,
    addVendor,
    deleteVendor,
    updateVendor
} = require('../controllers/vendor');

const router = express.Router();


router.get('/getvendors',getVendors);
router.post('/addvendor', validateParams([
    {
        param_key: 'englishName',
        required: true,
        type: 'string'
    },
    {
        param_key: 'telephone1',
        required: true,
        type: 'string'
    },
    {
        param_key: 'address',
        required: true,
        type: 'string'
    },
    {
        param_key: 'zipcode',
        required: true,
        type: 'string'
    },
    {
        param_key: 'taxno',
        required: true,
        type: 'string'
    },
    {
        param_key: 'contactPersonName',
        required: true,
        type: 'string'
    },
    {
        param_key: 'contactPersonTelephone',
        required: true,
        type: 'string'
    }
]), addVendor);
router.delete('/deletevendor/:_id', deleteVendor);
router.put('/updatevendor', updateVendor);

module.exports = router;
