const express = require('express');

const {
    getECR,
    getECRById,
    addECR,
    deleteECR,
    updateECR
} = require('../controllers/ECR');

const router = express.Router();
router.get('/getecr/:id', getECRById);
router.get('/getecr', getECR);
router.post('/addecr', addECR);
router.delete('/deleteecr/:_id', deleteECR);
router.put('/updateecr', updateECR);

module.exports = router;
