const express = require('express');
const router = express.Router();
const { Industry } = require('../models'); // Ensure Industry model are imported



//Get all Industry users
router.get('/industry', async (req, res) => {
  console.log('get all industry users')
  try {
    const industries = await Industry.findAll();
    res.json(industries);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving industries' });
  }
});

module.exports = router;