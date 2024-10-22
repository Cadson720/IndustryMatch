const express = require('express');
const router = express.Router();
const { EOI, Industry, Academic, Project } = require('../models'); // Import models

// Route to get all EOIs
router.get('/eoi', async (req, res) => {
  try {
    const eois = await EOI.findAll({
      include: [
        { model: Industry },
        { model: Academic },
        { model: Project }
      ]
    });
    res.json(eois);
  } catch (error) {
    console.error('Error fetching EOIs:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});

// Route to get all EOIs by project_id
router.get('/eoi/project/:projectId', async (req, res) => {
    const { projectId } = req.params; // Extract projectId from the request parameters
  
    try {
      const eois = await EOI.findAll({
        where: {
          project_id: projectId // Filter by project_id
        },
        include: [
          { model: Industry },
          { model: Academic },
          { model: Project }
        ]
      });
      res.json(eois);
    } catch (error) {
      console.error(`Error fetching EOIs for project ${projectId}:`, error);
      res.status(500).json({ error: 'Error retrieving EOIs for the given project' });
    }
  });

  // Route to get all EOIs by academic_id (user)
router.get('/eoi/academic/:academicId', async (req, res) => {
    const { academicId } = req.params; // Extract academicId from the request parameters
  
    try {
      const eois = await EOI.findAll({
        where: {
          academic_id: academicId // Filter by academic_id
        },
        include: [
          { model: Industry },
          { model: Academic },
          { model: Project }
        ]
      });
      res.json(eois);
    } catch (error) {
      console.error(`Error fetching EOIs for academic ${academicId}:`, error);
      res.status(500).json({ error: 'Error retrieving EOIs for the given user' });
    }
  });

  // Route to get all EOIs by industry_id
router.get('/eoi/industry/:industryId', async (req, res) => {
    const { industryId } = req.params; // Extract industryId from the request parameters
  
    try {
      const eois = await EOI.findAll({
        where: {
          industry_id: industryId // Filter by industry_id
        },
        include: [
          { model: Industry },
          { model: Academic },
          { model: Project }
        ]
      });
      res.json(eois);
    } catch (error) {
      console.error(`Error fetching EOIs for industry ${industryId}:`, error);
      res.status(500).json({ error: 'Error retrieving EOIs for the given industry' });
    }
  });

module.exports = router;
