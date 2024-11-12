const express = require('express');
const jwt = require('jsonwebtoken');
const { SavedProject, Project, Industry } = require('../models');
const router = express.Router();
const jwtSecret = 'your_secret_key';

// Middleware to authenticate and verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token format

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Forbidden: Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};



// Get all saved projects for an academic user
router.get('/project/saved', authenticateToken, async (req, res) => {
  try {
    const academicId = req.user.profile.academic_id; // Use academic_id from token

    const savedProjects = await SavedProject.findAll({
      where: { academic_id: academicId },
      include: {
        model: Project,
        include: { model: Industry, as: 'Industry' }
      }
    });

    if (!savedProjects || savedProjects.length === 0) {
      return res.status(404).json({ message: 'No saved projects found for this academic' });
    }

    res.json(savedProjects);
  } catch (error) {
    console.error('Error retrieving saved projects:', error);
    res.status(500).json({ error: 'Failed to retrieve saved projects' });
  }
});

// Route to get saved projects for a specific academic
router.get('/project/saved/:academicId', async (req, res) => {
  const { academicId } = req.params;

  try {
    const savedProjects = await SavedProject.findAll({
      where: { academic_id: academicId },
      include: {
        model: Project,
        include: { model: Industry, as: 'Industry' },
      },
    });

    if (!savedProjects || savedProjects.length === 0) {
      return res.status(404).json({ message: 'No saved projects found for this academic' });
    }

    res.json(savedProjects);
  } catch (error) {
    console.error('Error retrieving saved projects:', error);
    res.status(500).json({ error: 'Failed to retrieve saved projects' });
  }
});


// Route to get all saved projects (no filtering by academic_id)
router.get('/project/saved/all', async (req, res) => {
  try {
    const savedProjects = await SavedProject.findAll({
      include: {
        model: Project,
        include: { model: Industry, as: 'Industry' },
      },
    });

    if (!savedProjects || savedProjects.length === 0) {
      return res.status(404).json({ message: 'No saved projects found' });
    }

    res.json(savedProjects);
  } catch (error) {
    console.error('Error retrieving saved projects:', error);
    res.status(500).json({ error: 'Failed to retrieve saved projects' });
  }
});

// Assuming Express and Sequelize are used on the backend
router.post('/project/save', authenticateToken, async (req, res) => {
  const { academic_id, project_id } = req.body;

  if (!academic_id || !project_id) {
    return res.status(400).json({ error: 'Missing academic_id or project_id' });
  }

  try {
    // Create a new record in the SavedProjects model
    const savedProject = await SavedProject.create({ academic_id, project_id });
    res.status(201).json({ message: 'Project saved successfully', savedProject });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});




module.exports = router;
