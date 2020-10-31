const express = require('express');
const {
    getPatientClearance,
    getPatientClearanceById,
    addPatientClearance,
    updatePatientClearance
  } = require('../controllers/patientClearance');

const router = express.Router();
router.get('/getpatientclearance', getPatientClearance);
router.get('/getpatientclearance/:id', getPatientClearanceById);
router.post('/addpatientclearance', addPatientClearance);
router.put('/updatepatientclearance', updatePatientClearance);
module.exports = router;
