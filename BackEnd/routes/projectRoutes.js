const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// Get all project
router.get('/project', async (req, res) => {
    try {
      console.log("start try");
      const project = await Project.findAll();
      console.log("findAll true");
      res.json(project);
      console.log("res true");
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: 'Error retrieving project' });
    }
  });

module.exports = router;