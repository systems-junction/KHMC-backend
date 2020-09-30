const express = require('express');
const {
  getInsurance,
  getInsuranceById,
  addInsurance,
  deleteInsurance,
  updateInsurance,
  addInsuranceVendor
} = require('../controllers/insurance');
const router = express.Router();
router.get('/getinsurance', getInsurance);
router.get('/getinsurancebyid/:_id', getInsuranceById);
router.post('/addinsurance', addInsurance);
router.post('/addinsurancevendor', addInsuranceVendor);
router.delete('/deleteinsurance/:_id', deleteInsurance);
router.put('/updateinsurance', updateInsurance);
module.exports = router;
