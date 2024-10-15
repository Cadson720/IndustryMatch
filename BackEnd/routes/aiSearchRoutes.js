const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models');

// AI-specific route for searching projects based on user inputs
router.get('/project/ai-search', async (req, res) => {
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

module.exports = router;
