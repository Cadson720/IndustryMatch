const express = require('express');
const jwt = require('jsonwebtoken');
const { Academic } = require('../models'); // Assuming Academic is your Sequelize model
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

// Route to get the logged-in academic user's profile information
router.get('/academic/profile', authenticateToken, async (req, res) => {
  try {
    const academicId = req.user.profile.academic_id;

    // Find the academic user by ID
    const academic = await Academic.findByPk(academicId, {
      attributes: ['academic_email', 'role', 'school'],
    });

    if (!academic) {
      return res.status(404).json({ error: 'Academic user not found' });
    }

    // Return academic user data
    return res.json(academic);
  } catch (error) {
    console.error('Error fetching academic data:', error);
    return res.status(500).json({ error: 'Failed to retrieve academic profile' });
  }
});

// Route to update the logged-in academic user's profile information
router.put('/academic/profile', authenticateToken, async (req, res) => {
  const { email, role, school } = req.body;
  const academicId = req.user.profile.academic_id;

  try {
    // Update academic profile in the database
    const academic = await Academic.findByPk(academicId);
    if (!academic) {
      return res.status(404).json({ error: 'Academic user not found' });
    }

    // Update the fields
    academic.academic_email = email;
    academic.role = role;
    academic.school = school;

    // Save the updated academic details
    await academic.save();

    // Return updated academic profile
    return res.json({
      academic_email: academic.academic_email,
      role: academic.role,
      school: academic.school,
    });
  } catch (error) {
    console.error('Error updating academic profile:', error);
    return res.status(500).json({ error: 'Failed to update academic profile' });
  }
});

module.exports = router;
