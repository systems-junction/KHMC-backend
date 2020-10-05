const express = require('express');

const {
getEDRandIPR,
addPAR,
updatePAR
} = require('../controllers/par');

const router = express.Router();

router.get('/getedrandipr', getEDRandIPR);
router.post('/addpar', addPAR);
router.put('/updatepar', updatePAR);

module.exports = router;
