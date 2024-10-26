const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { EOI, Industry, Academic, Project } = require('../models'); // Import models

// Secret key for signing JWT tokens
const jwtSecret = 'your_secret_key';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach the decoded token to req.user
    next();
  });
}

// GET route to retrieve academic profile based on JWT
router.get('/academic/profile', authenticateToken, async (req, res) => {
  try {
    const academic = await Academic.findOne({
      where: { academic_id: req.user.profile.academic_id },
      attributes: ['academic_email', 'role', 'school', 'academic_id'],
    });
    if (!academic) return res.status(404).json({ message: 'Academic profile not found' });
    res.json({ profile: academic });
  } catch (error) {
    console.error('Error fetching academic profile:', error);
    res.status(500).json({ error: 'Error retrieving academic profile' });
  }
});

// Route to get all EOIs
router.get('/eoi', async (req, res) => {
  try {
    const eois = await EOI.findAll({
      include: [
        { model: Industry },
        { model: Academic },
        { model: Project },
      ],
    });
    res.json(eois);
  } catch (error) {
    console.error('Error fetching EOIs:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});

// Route to submit a new EOI (application)
router.post('/eoi', authenticateToken, async (req, res) => {
  const { industry_id, academic_id, project_id, eoi_date, proposal_description, eoi_status } = req.body;

  try {
    if (!eoi_date || !proposal_description || !eoi_status) {
      return res.status(400).json({ error: 'Missing required fields: eoi_date, proposal_description, and eoi_status' });
    }

    const newEOI = await EOI.create({
      industry_id,
      academic_id,
      project_id,
      eoi_date,
      proposal_description,
      eoi_status,
    });

    res.status(201).json(newEOI);
  } catch (error) {
    console.error('Error creating EOI:', error);
    res.status(500).json({ error: 'Error creating EOI' });
  }
});

// Route to get project details by project_id
router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findOne({
      where: { project_id: projectId },
      include: [
        { model: Industry },
        {
          model: EOI,
          include: [{ model: Academic }, { model: Industry }],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error(`Error fetching project details for project ${projectId}:`, error);
    res.status(500).json({ error: 'Error retrieving project details' });
  }
});

module.exports = router;
