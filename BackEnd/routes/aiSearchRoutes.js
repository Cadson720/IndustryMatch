const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models');
const { Op } = require('sequelize'); // Import Sequelize Operators for advanced querying

// AI-specific route for searching projects based on user inputs
router.get('/project/ai-search', async (req, res) => {
  try {
    // Extract query parameters for filtering
    const { keywords, discipline, duration, size, industry, location } = req.query;

    // Create a dynamic filter object based on the AI's input
    let filters = {};

    // Filtering logic for keywords (search in title or discipline)
    if (keywords) {
      filters[Op.or] = [
        { title: { [Op.iLike]: `%${keywords}%` } },  // Case-insensitive search in project title
        { discipline: { [Op.iLike]: `%${keywords}%` } }  // Case-insensitive search in discipline
      ];
    }

    // Filtering by discipline if provided
    if (discipline) {
      filters.discipline = { [Op.iLike]: `%${discipline}%` }; // Case-insensitive exact match or partial match
    }

    // Filtering by duration if provided
    if (duration) {
      filters.duration = duration; // Exact match for duration
    }

    // Filtering by size if provided
    if (size) {
      filters.size = size; // Exact match for size (small, medium, large)
    }

    // Filtering by industry if provided
    if (industry) {
      filters.industry = { [Op.iLike]: `%${industry}%` }; // Case-insensitive match for industry
    }

    // Filtering by location if provided
    if (location) {
      filters.location = { [Op.iLike]: `%${location}%` }; // Case-insensitive match for location
    }

    // Fetch projects from the database using the filters
    const projects = await Project.findAll({
      where: filters,
      include: {
        model: Industry, // Include the Industry model
        as: 'Industry',  // Alias used in the association
      },
    });

    // If no projects are found, return a meaningful message
    if (projects.length === 0) {
      return res.status(404).json({ message: 'No matching projects found based on your search criteria.' });
    }

    // Respond with the filtered projects
    res.json(projects);
  } catch (error) {
    console.error('Error retrieving projects:', error);
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
});

module.exports = router;