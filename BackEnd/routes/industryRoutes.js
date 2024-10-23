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
    const industryId = req.user.profile.industry_id;

    const industry = await Industry.findByPk(industryId, {
      attributes: ['industry_email', 'industry_discipline', 'organisation'],
    });

    if (!industry) {
      return res.status(404).json({ error: 'Industry profile not found' });
    }

    return res.json({
      industry_email: industry.industry_email,
      industry_discipline: industry.industry_discipline,
      organisation: industry.organisation,
    });
  } catch (error) {
    console.error('Error fetching industry profile:', error);
    return res.status(500).json({ error: 'Failed to retrieve industry profile' });
  }
});


// Route to update the logged-in industry user's profile information
router.put('/industry/profile', authenticateToken, async (req, res) => {
  const { email, industry_discipline, organisation } = req.body;
  const industryId = req.user.profile.industry_id;

  try {
    // Log received data
    console.log('Received data:', req.body);

    // Find the industry profile in the database
    const industryProfile = await Industry.findByPk(industryId);
    if (!industryProfile) {
      return res.status(404).json({ error: 'Industry user not found' });
    }

    // Log existing profile details before update
    console.log('Existing profile:', industryProfile);

    // Update the fields
    industryProfile.industry_email = email;
    industryProfile.industry_discipline = industry_discipline;
    industryProfile.organisation = organisation;

    // Save the updated industry details
    await industryProfile.save();

    // Log updated profile
    console.log('Updated profile:', industryProfile);

    // Return updated industry profile
    return res.json({
      industry_email: industryProfile.industry_email,
      industry_discipline: industryProfile.industry_discipline,
      organisation: industryProfile.organisation,
    });
  } catch (error) {
    console.error('Error updating industry profile:', error);
    return res.status(500).json({ error: 'Failed to update industry profile' });
  }
});


module.exports = router;
