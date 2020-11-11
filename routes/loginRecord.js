const express = require('express');

const {
    createRecord,
    recordLogout
} = require('../controllers/loginRecord');

const router = express.Router();

router.post('/createLogin', createRecord);
router.post('/recordLogout', recordLogout)
module.exports = router;
