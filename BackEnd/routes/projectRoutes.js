const express = require('express');
const router = express.Router();
const { Project, Industry } = require('../models'); // Import both models

// Get all projects with their associated industry (or member)
router.get('/project', async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                {
                    model: Industry, // Include the Industry model
                    attributes: ['email', 'organisation'] // Select the fields you want
                }
            ]
        });
        res.json(projects); // Return the projects with the included Industry data
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error retrieving projects' });
    }
});

module.exports = router;
