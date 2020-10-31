const express = require('express');
const {
  getAccessLevel,
  addAccessLevel,
  deleteAccessLevel,
  updateAccessLevel,
} = require('../controllers/accessLevel');
const router = express.Router();
router.get('/getaccesslevel', getAccessLevel);
router.post('/addaccesslevel', addAccessLevel);
router.delete('/deleteaccesslevel/:_id', deleteAccessLevel);
router.put('/updateaccesslevel', updateAccessLevel);
module.exports = router;
