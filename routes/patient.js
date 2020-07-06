const express = require('express');
const {
    getPatient,
    getPatientById,
    addPatient,
    deletePatient,
    updatePatient
} = require('../controllers/patient');

const router = express.Router();

router.get('/getpatient/:id', getPatientById);
router.get('/getpatient', getPatient);
router.post('/addpatient', addPatient);
router.delete('/deletepatient/:_id', deletePatient);
router.put('/updatepatient', updatePatient);

module.exports = router;
