const express = require('express');

const {
    getIPR,
    getDischargeIPR,
    getDischargeIPRById,
    putDischargeIPRById,
    getPHRIPR,
    getPHRIPRById,
    putPHRIPRById,
    getLRIPR,
    getLRIPRById,
    putLRIPRById,
    getRRIPR,
    getRRIPRById,
    putRRIPRById,
    getIPRById,
    addIPR,
    deleteIPR,
    updateIPR
} = require('../controllers/IPR');

const router = express.Router();
router.get('/getipr/:_id', getIPRById);
router.get('/getipr', getIPR);
router.get('/getdischargeipr', getDischargeIPR);
router.get('/getdischargeipr/:_id', getDischargeIPRById);
router.put('/updatedischarge', putDischargeIPRById);
router.get('/getphripr', getPHRIPR);
router.get('/getphripr/:_id', getPHRIPRById);
router.put('/updatephr', putPHRIPRById);
router.get('/getlripr', getLRIPR);
router.get('/getlripr/:_id', getLRIPRById);
router.put('/updatelab', putLRIPRById);
router.get('/getrripr', getRRIPR);
router.get('/getrripr/:_id', getRRIPRById);
router.put('/updaterad', putRRIPRById);
router.post('/addipr', addIPR);
router.delete('/deleteipr/:_id', deleteIPR);
router.put('/updateipr', updateIPR);

module.exports = router;
