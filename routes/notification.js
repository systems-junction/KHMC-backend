const express = require('express');

const {
    getNotification,
    updateNotification
} = require('../controllers/notification');

const router = express.Router();

router.get('/getnotifications/:id', getNotification);
router.get('/updatenotifications/:id/:userId', updateNotification);

module.exports = router;
