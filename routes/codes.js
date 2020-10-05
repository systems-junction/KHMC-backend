const express = require('express');
const {
    getCPT,
    getCPTCategories,
    getCPTByCategories,
    getCPTById,
    getICD,
    getICDCategories,
    getICDByCategories,
    getICDById
} = require('../controllers/codes');

const router = express.Router();
router.get('/getcpt', getCPT);
router.get('/getcptcat', getCPTCategories);
router.get('/getcptcat/:code', getCPTByCategories);
router.get('/getcpt/:id', getCPTById);
router.get('/geticd', getICD);
router.get('/geticdcat', getICDCategories);
router.get('/geticdcat/:code', getICDByCategories);
router.get('/geticd/:id', getICDById);
module.exports = router;
