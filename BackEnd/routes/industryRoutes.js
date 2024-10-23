const express = require('express');
const jwt = require('jsonwebtoken');
const { Industry } = require('../models'); // Assuming Industry is your Sequelize model
const router = express.Router();
const jwtSecret = 'your_secret_key'; // Use your JWT secret key

// Middleware to authenticate and verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token format

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Verify token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
    req.user = decoded; // Attach the decoded user to the request
    next();
  });
};

router.get('/industry/profile', authenticateToken, async (req, res) => {
  try {
    const industryId = req.user.profile.industry_id; // Check if industry_id exists in the decoded JWT

    const industry = await Industry.findByPk(industryId, {
      attributes: ['industry_email', 'industry_discipline', 'organisation'], // Use the correct columns
    });

    if (!industry) {
      return res.status(404).json({ error: 'Industry profile not found' });
    }

    return res.json(industry);
  } catch (error) {
    console.error('Error fetching industry profile:', error); // Log the error
    return res.status(500).json({ error: 'Failed to retrieve industry profile' });
  }
});

// Route to update the logged-in industry user's profile information
router.put('/industry/profile', authenticateToken, async (req, res) => {
  const { email, industry, department } = req.body;
  const industryId = req.user.profile.industry_id; // Extract industry ID from the decoded token

  try {
    // Find the industry profile in the database
    const industryProfile = await Industry.findByPk(industryId);
    if (!industryProfile) {
      return res.status(404).json({ error: 'Industry user not found' });
    }

    // Update the fields
    industryProfile.industry_email = email;
    industryProfile.industry = industry;
    industryProfile.department = department;

    // Save the updated industry details
    await industryProfile.save();

    // Return updated industry profile
    return res.json({
      industry_email: industryProfile.industry_email,
      industry: industryProfile.industry,
      department: industryProfile.department,
    });
  } catch (error) {
    console.error('Error updating industry profile:', error);
    return res.status(500).json({ error: 'Failed to update industry profile' });
  }
});

module.exports = router;
