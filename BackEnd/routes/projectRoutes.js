const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models'); // Ensure both Project and Industry models are imported

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
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Error retrieving projects' });
  }
});

// Get a specific project by ID
router.get('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id, {
      include: {
        model: Industry, // Include the Industry model
        as: 'Industry'   // Alias used in the association
      }
    });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error retrieving project:', error);
    res.status(500).json({ error: 'Error retrieving project' });
  }
});

// Create a new project
router.post('/project', async (req, res) => {
  try {
    // Assuming req.body has all required fields matching the Project model
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update an existing project by ID
router.put('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update(req.body); // Update project with new data from req.body
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete a project by ID
router.delete('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.destroy(); // Delete the project
    res.status(204).send(); // Send 204 No Content response after deletion
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
