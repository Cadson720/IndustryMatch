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

  // Route to create a new EOI
router.post('/eoi', async (req, res) => {
    const { industry_id, academic_id, project_id, eoi_date, class_size, eoi_status } = req.body;
  
    try {
      // Validate the incoming data (you can add more validations as needed)
      if (!eoi_date || !class_size || !eoi_status) {
        return res.status(400).json({ error: 'Missing required fields: eoi_date, class_size, and eoi_status' });
      }
  
      // Create the new EOI
      const newEOI = await EOI.create({
        industry_id,
        academic_id,
        project_id,
        eoi_date,
        class_size,
        eoi_status
      });
  
      // Send the newly created EOI in the response
      res.status(201).json(newEOI);
    } catch (error) {
      console.error('Error creating EOI:', error);
      res.status(500).json({ error: 'Error creating EOI' });
    }
});

// Route to create a new EOI
router.post('/eoi', async (req, res) => {
    const { industry_id, academic_id, project_id, eoi_date, class_size, eoi_status } = req.body;
  
    try {
      // Validate the incoming data (you can add more validations as needed)
      if (!eoi_date || !class_size || !eoi_status) {
        return res.status(400).json({ error: 'Missing required fields: eoi_date, class_size, and eoi_status' });
      }
  
      // Create the new EOI
      const newEOI = await EOI.create({
        industry_id,
        academic_id,
        project_id,
        eoi_date,
        class_size,
        eoi_status
      });
  
      // Send the newly created EOI in the response
      res.status(201).json(newEOI);
    } catch (error) {
      console.error('Error creating EOI:', error);
      res.status(500).json({ error: 'Error creating EOI' });
    }
  });

module.exports = router;
