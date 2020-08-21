const express = require('express');

const {
    getEDR,
    getDischargeEDR,
    getDischargeEDRById,
    putDischargeEDRById,
    getPHREDR,
    getPHREDRById,
    putPHREDRById,
    getLREDR,
    getLREDRById,
    putLREDRById,
    getRREDR,
    getRREDRById,
    putRREDRById,
    getEDRById,
    addEDR,
    addRadiologyRequest,
    deleteEDR,
    updateEDR,
    addLabRequest
} = require('../controllers/EDR');

const router = express.Router();
router.get('/getedr/:_id', getEDRById);
router.get('/getedr', getEDR);
router.get('/getdischargeedr', getDischargeEDR);
router.get('/getdischargeedr/:_id', getDischargeEDRById);
router.put('/updatedischarge', putDischargeEDRById);
router.get('/getphredr', getPHREDR);
router.get('/getphredr/:_id', getPHREDRById);
router.put('/updatephr', putPHREDRById);
router.get('/getlredr', getLREDR);
router.get('/getlredr/:_id', getLREDRById);
router.put('/updatelab', putLREDRById);
router.get('/getrredr', getRREDR);
router.get('/getrredr/:_id', getRREDRById);
router.put('/updaterad', putRREDRById);
router.post('/addedr', addEDR);
router.delete('/deleteedr/:_id', deleteEDR);
router.put('/updateedr', updateEDR);
router.put('/addrr', addRadiologyRequest);
router.put('/addlr', addLabRequest)

module.exports = router;
