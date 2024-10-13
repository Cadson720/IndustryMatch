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


// Route to create a new project
router.post('/project', async (req, res) => {
  try {
    const newProject = await Project.create(req.body);
    res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create project' });
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

// Route to update an existing project
router.put('/project/:id', async (req, res) => {
  const projectId = req.params.id;
  const {
    title,
    publish_date,
    industry,
    discipline,
    duration,
    size,
    location_type,
    address,
    description,
    status,
    image_path
  } = req.body;

  try {
    // Find the project by ID
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Update the project's details
    project.title = title;
    project.publish_date = publish_date;
    project.industry = industry;
    project.discipline = discipline;
    project.duration = duration;
    project.size = size;
    project.location_type = location_type;
    project.address = address;
    project.description = description;
    project.status = status;
    project.image_path = image_path;

    // Save the updated project
    await project.save();

    res.json(project); // Return the updated project
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

module.exports = router;
