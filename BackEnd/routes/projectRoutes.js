const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models');
const { Op } = require('sequelize');

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

// Search projects based on query parameters
router.get('/project/search', async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { keywords, discipline, duration, size, industry, location } = req.query;

    // Log incoming query parameters for debugging
    console.log("Search parameters received:", { keywords, discipline, duration, size, industry, location });

    // Create a dynamic filter object based on the user's input
    let filters = {};

    // Add conditions to the filters object based on the provided query parameters
    if (keywords && keywords.trim() !== '') {
      filters[Op.or] = [
        { title: { [Op.iLike]: `%${keywords}%` } },  // Case-insensitive search in project title
        { discipline: { [Op.iLike]: `%${keywords}%` } }  // Case-insensitive search in discipline
      ];
    }

    if (discipline && discipline.trim() !== '') {
      filters.discipline = { [Op.iLike]: `%${discipline}%` }; // Case-insensitive partial match for discipline
    }

    if (duration && duration.trim() !== '') {
      filters.duration = duration; // Exact match for duration
    }

    if (size && size.trim() !== '') {
      filters.size = size; // Exact match for size (small, medium, large)
    }

    if (industry && industry.trim() !== '') {
      filters.industry = { [Op.iLike]: `%${industry}%` }; // Case-insensitive match for industry
    }

    if (location && location.trim() !== '') {
      filters.location_type = { [Op.iLike]: `%${location}%` }; // Case-insensitive match for location
    }

    // Log filters before executing the query
    console.log("Filters applied:", filters);

    // Fetch filtered projects from the database
    const projects = await Project.findAll({
      where: filters, // Apply the dynamic filters object
      limit: 5, // Optionally limit the result to 5 projects
    });

    // Log query result
    console.log("Projects found:", projects.length);

    // Return the filtered projects
    if (projects.length > 0) {
      res.json(projects);
    } else {
      res.status(404).json({ message: 'No matching projects found based on your search criteria.' });
    }
  } catch (error) {
    // Log the error details for debugging
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects', details: error.message });
  }
});

// Other project routes like get by ID, create, update, delete, etc.
router.get('/project/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id, {
      include: {
        model: Industry,
        as: 'Industry'
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
