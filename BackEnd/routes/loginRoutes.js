const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Academic, Industry, Admin } = require('../models');

// Secret key to sign JWTs
const jwtSecret = 'your_secret_key';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // Verify the token
  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach the decoded token to req.user
    next(); // Call the next middleware or route handler
  });
}

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // First check Academic users
    let user = await Academic.findOne({ where: { academic_email: email, academic_password: password } });
    if (user) {
      const token = jwt.sign({ type: 'Academic', profile: user }, jwtSecret, { expiresIn: '30m' });
      return res.json({ token });
    }

    // Then check Industry users
    user = await Industry.findOne({ where: { industry_email: email, industry_password: password } });
    if (user) {
      const token = jwt.sign({ type: 'Industry', profile: user }, jwtSecret, { expiresIn: '30m' });
      return res.json({ token });
    }

    // Lastly, check Admin users
    user = await Admin.findOne({ where: { admin_email: email, admin_password: password } });
    if (user) {
      const token = jwt.sign({ type: 'Admin', profile: user }, jwtSecret, { expiresIn: '30m' });
      return res.json({ token });
    }

    // If no user is found, return invalid credentials
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Example of a protected route that requires a valid token
router.get('/protected', authenticateToken, (req, res) => {
  // Access the decoded token information from req.user
  res.json({ message: `Hello, ${req.user.profile.name}`, userType: req.user.type });
});

module.exports = router;
