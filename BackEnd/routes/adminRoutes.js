const express = require('express');
const router = express.Router();
const { Admin } = require('../models'); // Ensure Industry model are imported



//Get all Industry users
router.get('/admin', async (req, res) => {
  console.log('get all admin users')
  try {
    const industries = await Admin.findAll();
    res.json(industries);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving admin' });
  }
});

module.exports = router;