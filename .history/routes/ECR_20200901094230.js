const express = require('express');

const {
  getECRfromEDR,
  getECRfromIPR,
  getECRById,
  addECR,
  deleteECR,
  updateECR,
  getECR,
} = require('../controllers/ECR');

const router = express.Router();
router.get('/getecr/:id', getECRById);
router.get('/getecrfromedr/:_id', getECRfromEDR);
router.get('/getecrfromipr/:_id', getECRfromIPR);
router.post('/addecr', addECR);
router.delete('/deleteecr/:_id', deleteECR);
router.put('/updateecr', updateECR);
router.get('/getecr', getECR);

module.exports = router;
