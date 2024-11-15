const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { EOI, Industry, Academic, Project } = require('../models'); // Import models

// Route to fetch EOIs by projectId
router.get('/eoi/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  // Validate projectId
  if (!projectId || isNaN(parseInt(projectId, 10))) {
    return res.status(400).json({ error: 'Invalid Project I' });
  }

  try {
    // Fetch EOIs with the corresponding projectId and include academic email
    const eois = await EOI.findAll({
      where: { project_id: parseInt(projectId, 10) },
      include: [
        {
          model: Academic,
          attributes: ['academic_email'],
        },
      ],
    });

    // Check if EOIs are found
    if (eois.length === 0) {
      return res.status(404).json({ message: 'No EOIs found for this project' });
    }

    // Send the EOIs as a JSON response
    res.json(eois);
  } catch (error) {
    console.error('Error fetching EOIs by project ID:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});

// Route to update EOI status without authentication
router.put('/eoi/:eoiId', async (req, res) => {
  const { eoiId } = req.params; // Corrected variable name
  const { eoi_status } = req.body;

  if (!eoi_status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const eoi = await EOI.findByPk(eoiId); // Use eoiId here

    if (!eoi) {
      return res.status(404).json({ error: 'EOI not found' });
    }

    // Update the EOI status
    eoi.eoi_status = eoi_status;
    await eoi.save();

    res.status(200).json({ message: 'EOI status updated successfully', eoi });
  } catch (error) {
    console.error('Error updating EOI status:', error);
    res.status(500).json({ error: 'Error updating EOI status' });
  }
});


// Route All
router.get('/eoi', async (req, res) => {
  try {
    const eois = await EOI.findAll();
    res.json(eois);
  } catch (error) {
    console.error('Error fetching EOIs:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});

// Route EOI by Academic ID
router.get('/eoi/academic/:academicId', async (req, res) => {
  const { academicId } = req.params;

  try {
    const eois = await EOI.findAll({
      where: { academic_id: academicId },
    });

    if (eois.length === 0) {
      return res.status(404).json({ message: 'No EOIs found for this academic' });
    }

    res.json(eois); 
  } catch (error) {
    console.error('Error fetching EOIs by academic ID:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});

// Route EOI by Industry ID
router.get('/eoi/industry/:industryId', async (req, res) => {
  const { industryId } = req.params;

  try {
    const eois = await EOI.findAll({
      where: { industry_id: industryId },
    });

    if (eois.length === 0) {
      return res.status(404).json({ message: 'No EOIs found for this industry' });
    }

    res.json(eois); 
  } catch (error) {
    console.error('Error fetching EOIs by industry ID:', error);
    res.status(500).json({ error: 'Error retrieving EOIs' });
  }
});



// Route to submit a new EOI (application)
router.post('/eoi', authenticateToken, async (req, res) => {
  const { industry_id, academic_id, project_id, eoi_date, proposal_description, eoi_status } = req.body;
  try {
    // Check for required fields
    if (!eoi_date || !proposal_description || !eoi_status) {
      return res.status(400).json({ error: 'Missing required fields: eoi_date, proposal_description, and eoi_status' });
    }
    // Create a new EOI entry in the database
    const newEOI = await EOI.create({
      industry_id,
      academic_id,
      project_id,
      eoi_date,
      proposal_description,
      eoi_status,
    });
    // Respond with the newly created EOI entry
    res.status(201).json(newEOI);
    } catch (error) {
      console.error('Error creating EOI:', error);
      res.status(500).json({ error: 'Error creating EOI' });
    }
});

// Secret key for signing JWT tokens
const jwtSecret = 'your_secret_key';

// Middleware to verify JWT token
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting 'Bearer <token>'
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded; // Attach the decoded token to req.user
    next();
  });
}

// GET route to retrieve academic profile based on JWT
router.get('/academic/profile', authenticateToken, async (req, res) => {
  try {
    const academic = await Academic.findOne({
      where: { academic_id: req.user.profile.academic_id },
      attributes: ['academic_email', 'role', 'school', 'academic_id'],
    });
    if (!academic) return res.status(404).json({ message: 'Academic profile not found' });
    res.json({ profile: academic });
  } catch (error) {
    console.error('Error fetching academic profile:', error);
    res.status(500).json({ error: 'Error retrieving academic profile' });
  }
});


module.exports = router;
