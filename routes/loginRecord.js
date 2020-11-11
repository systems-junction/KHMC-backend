const express = require('express');

const {
    createRecord
} = require('../controllers/loginRecord');

const router = express.Router();

router.post('/createLogin', createRecord);

module.exports = router;
