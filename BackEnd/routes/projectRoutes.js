const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models'); // Ensure both Project and Industry models are imported

// Get all projects
// Get all projects with associated Industry (member) information
router.get('/project', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: {
        model: Industry, // Include the Industry model
        as: 'Industry'   // Alias used in the association
      }
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving projects' });
  }
});

// Create a new project
router.post('/project', async (req, res) => {
  try {
    const newProject = await Project.create(req.body); // Creating project using the request body data
    res.status(201).json(newProject); // Send a success response with the newly created project
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

module.exports = router;
