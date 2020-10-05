const express = require('express');
const {
  getInsurance,
  getInsuranceById,
  addInsurance,
  deleteInsurance,
  updateInsurance,
} = require('../controllers/insurance');
const router = express.Router();
router.get('/getinsurance', getInsurance);
router.get('/getinsurancebyid/:_id', getInsuranceById);
router.post('/addinsurance', addInsurance);
router.delete('/deleteinsurance/:_id', deleteInsurance);
router.put('/updateinsurance', updateInsurance);
module.exports = router;
