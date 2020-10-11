const express = require('express');

const {
    getAccount,
    getAccountKeyword,
    getAccountById,
    updateAccount
} = require('../controllers/account');
const router = express.Router();
router.get('/getaccounts', getAccount);
router.get('/getaccount/:keyword', getAccountKeyword);
router.get('/getaccounts/:_id', getAccountById);
router.put('/updateaccounts', updateAccount);
module.exports = router;
