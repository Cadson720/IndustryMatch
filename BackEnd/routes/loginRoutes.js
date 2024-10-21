const express = require('express');
const router = express.Router();
const { Academic, Industry, Admin } = require('../models');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Received login request for:', email); // Log the email for debugging

  try {
    // First check Academic users
    let user = await Academic.findOne({ where: { academic_email: email, academic_password: password } });
    if (user) {
      console.log('User found in Academic');
      return res.json({ type: 'Academic', profile: user });
    }

    // Then check Industry users
    user = await Industry.findOne({ where: { industry_email: email, industry_password: password } });
    if (user) {
      console.log('User found in Industry');
      return res.json({ type: 'Industry', profile: user });
    }

    // Lastly, check Admin users
    user = await Admin.findOne({ where: { admin_email: email, admin_password: password } });
    if (user) {
      console.log('User found in Admin');
      return res.json({ type: 'Admin', profile: user });
    }

    // If no user is found, return invalid credentials
    console.log('No user found');
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
