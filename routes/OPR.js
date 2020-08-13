const express = require('express');

const {
  getOPRAll,
  getOPRFromLab,
  getOPRFromPharmacy,
  getOPRFromRadiology,
  getOPRById,
  addOPR,
  deleteOPR,
  updateOPR,
} = require('../controllers/OPR');

const router = express.Router();
router.get('/getoprall', getOPRAll);
router.get('/getoprfromlab', getOPRFromLab);
router.get('/getoprfrompharmacy', getOPRFromPharmacy);
router.get('/getoprfromradiology', getOPRFromRadiology);
router.get('/getopr/:_id', getOPRById);
router.post('/addopr', addOPR);
router.delete('/deleteopr/:_id', deleteOPR);
router.put('/updateopr', updateOPR);

module.exports = router;
