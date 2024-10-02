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

router.put('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id); // Find the project by its ID
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.update(req.body); // Update the project with new data
    res.json(project); // Send the updated project as a response
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});



// Delete a project by ProjectID
router.delete('/project/:id', async (req, res) => {
  const { id } = req.params; // Extract the project ID from the request parameters
  try {
    const project = await Project.findByPk(id); // Find the project by its primary key (ID)
    if (!project) {
      return res.status(404).json({ error: 'Project not found' }); // Return 404 if project doesn't exist
    }
    await project.destroy(); // Delete the project
    res.status(204).send(); // Send a 204 No Content response on successful deletion
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
