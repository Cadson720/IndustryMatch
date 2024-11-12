const express = require('express');
const jwt = require('jsonwebtoken');
const { Industry } = require('../models'); // Sequelize Industry model
const router = express.Router();
const jwtSecret = 'your_secret_key'; // JWT secret key

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
      attributes: ['industry_id', 'industry_email', 'industry_discipline', 'organisation'], // Include industry_id here
    });

    if (!industry) {
      console.log('Industry profile not found for industryId:', industryId); // Logging
      return res.status(404).json({ error: 'Industry profile not found' });
    }
    return res.json({
      industry_id: industry.industry_id, // Include industry_id in the response
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
    console.log('Received data:', req.body);

    // Find the industry profile in the database
    const industryProfile = await Industry.findByPk(industryId);
    if (!industryProfile) {
      return res.status(404).json({ error: 'Industry user not found' });
    }

    console.log('Existing profile:', industryProfile);

    // Update the fields
    industryProfile.industry_email = email;
    industryProfile.industry_discipline = industry_discipline;
    industryProfile.organisation = organisation;

    // Save the updated industry details
    await industryProfile.save();

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

// POST Route to create a new Industry user
router.post('/industry', authenticateToken, async (req, res) => {
  const { industry_email, industry_discipline, organisation, industry_password } = req.body;

  // Ensure all fields are provided
  if (!industry_email || !industry_discipline || !organisation || !industry_password) {
    return res.status(400).json({ error: 'Please provide all required fields' });
  }

  try {
    // Check if the email already exists
    const existingIndustry = await Industry.findOne({ where: { industry_email } });
    if (existingIndustry) {
      return res.status(409).json({ error: 'Industry email already exists' });
    }

    // Create a new Industry entry
    const newIndustry = await Industry.create({
      industry_email,
      industry_discipline,
      organisation,
      industry_password,
    });

    // Return the newly created industry entry (without the password for security)
    return res.status(201).json({
      industry_id: newIndustry.industry_id,
      industry_email: newIndustry.industry_email,
      industry_discipline: newIndustry.industry_discipline,
      organisation: newIndustry.organisation,
    });
  } catch (error) {
    console.error('Error creating new industry:', error);
    return res.status(500).json({ error: 'Failed to create industry' });
  }
});

module.exports = router;
