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
      const token = jwt.sign({ type: 'Academic', profile: user }, jwtSecret, { expiresIn: '7d' });
      return res.json({ token });
    }

    // Then check Industry users
    user = await Industry.findOne({ where: { industry_email: email, industry_password: password } });
    if (user) {
      const token = jwt.sign({ type: 'Industry', profile: user }, jwtSecret, { expiresIn: '7d' });
      return res.json({ token });
    }

    // Lastly, check Admin users
    user = await Admin.findOne({ where: { admin_email: email, admin_password: password } });
    if (user) {
      const token = jwt.sign({ type: 'Admin', profile: user }, jwtSecret, { expiresIn: '7d' });
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

// Register endpoint
router.post('/register', async (req, res) => {
  const { email, password, userType, role, school, organisation, discipline } = req.body;

  try {
    let newUser;
    if (userType === 'Academic') {
      // Check if an Academic user with the email already exists
      const existingAcademic = await Academic.findOne({ where: { academic_email: email } });
      if (existingAcademic) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create new Academic user
      newUser = await Academic.create({
        academic_email: email,
        academic_password: password, // Store password as plain text
        role,
        school
      });
    } else if (userType === 'Industry') {
      // Check if an Industry user with the email already exists
      const existingIndustry = await Industry.findOne({ where: { industry_email: email } });
      if (existingIndustry) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Create new Industry user
      newUser = await Industry.create({
        industry_email: email,
        industry_password: password, // Store password as plain text
        organisation,
        industry_discipline: discipline
      });
    } else {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Automatically log in the user by generating a JWT token
    const token = jwt.sign({ type: userType, profile: newUser }, jwtSecret, { expiresIn: '1h' });
    
    // Respond with success and the JWT token
    res.status(201).json({ message: 'Registration and login successful', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;