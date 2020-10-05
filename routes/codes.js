const express = require('express');
const {
    getCPT,
    getCPTById,
    getICD,
    getICDById,
    getICDCategories,
    getICDByCategories
} = require('../controllers/codes');

const router = express.Router();
router.get('/getcpt', getCPT);
router.get('/getcpt/:id', getCPTById);
router.get('/geticd', getICD);
router.get('/geticdcat', getICDCategories);
router.get('/geticdcat/:code', getICDByCategories);
router.get('/geticd/:id', getICDById);
module.exports = router;
