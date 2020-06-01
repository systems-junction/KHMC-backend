const express = require('express');
const { validateParams } = require('../middleware/validator');

const {
    getItems,
    getSearchedItems,
    addItem,
    deleteItem,
    updateItem
} = require('../controllers/item');

const router = express.Router();


router.get('/getitems', getItems);
router.get('/getsearcheditems/:keyword', getSearchedItems);
router.post('/additem', validateParams([
    {
        param_key: 'name',
        required: true,
        type: 'string'
    },
    {
        param_key: 'description',
        required: true,
        type: 'string'
    },
    {
        param_key: 'subClass',
        required: true,
        type: 'string'
    },
    {
        param_key: 'itemCode',
        required: true,
        type: 'string'
    },
    {
        param_key: 'receiptUnit',
        required: true,
        type: 'string'
    },
    {
        param_key: 'issueUnit',
        required: true,
        type: 'string'
    },
    {
        param_key: 'purchasePrice',
        required: true,
        type: 'string'
    },
    {
        param_key: 'minimumLevel',
        required: true,
        type: 'string'
    },
    {
        param_key: 'maximumLevel',
        required: true,
        type: 'string'
    },
    {
        param_key: 'reorderLevel',
        required: true,
        type: 'string'
    }
  ]), addItem);
router.delete('/deleteitem/:_id', deleteItem);
router.put('/updateitem', updateItem);

module.exports = router;
