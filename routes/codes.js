const express = require('express');
const {
    getCPT,
    getCPTById,
    getICD,
    getICDById

} = require('../controllers/codes');

const router = express.Router();
router.get('/getcpt', getCPT);
router.get('/getcpt/:id', getCPTById);
router.get('/geticd', getICD);
router.get('/geticd/:id', getICDById);
module.exports = router;
