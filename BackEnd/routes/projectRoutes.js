const express = require('express');
const router = express.Router();
const { Project, Industry, EOI } = require('../models'); // Include EOI model
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // Import Op from Sequelize

// Middleware to extract `industry_id` from the token
const authenticateAndExtractIndustryId = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // Verify and decode the token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    if (decoded.type !== 'Industry') {
      return res.status(403).json({ message: 'Unauthorized access for non-industry users' });
    }

    // Extract `industry_id` and ensure it is a number
    req.industry_id = Number(decoded.profile.industry_id);
    if (isNaN(req.industry_id)) {
      return res.status(400).json({ message: 'Invalid industry ID' });
    }
    next();
  });
};

// Route to fetch all projects for the logged-in industry user
router.get('/project/industry', authenticateAndExtractIndustryId, async (req, res) => {
  const { industry_id } = req; // `industry_id` should be a number

  try {
    // Use Sequelize `where` clause to ensure `industry_id` is used correctly as a number
    const projects = await Project.findAll({
      where: { industry_id: { [Op.eq]: industry_id } }, // Explicitly use `Op.eq` for equality
      include: {
        model: Industry,
        as: 'Industry',
      },
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found for your industry' });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error retrieving projects by industry ID:', error);
    res.status(500).json({ error: 'Failed to retrieve projects for the industry' });
  }
});


// Middleware to extract `academic_id` from the token
const authenticateAndExtractAcademicId = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  // Verify and decode the token
  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.academic_id = decoded.profile.academic_id; // Extract and attach `academic_id` to the request
    next();
  });
};

// Route to fetch all projects for the `ProjectSearch` component
router.get('/project', async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: {
        model: Industry,
        as: 'Industry' // Ensure alias matches Sequelize model association
      }
    });

    if (!projects || projects.length === 0) {
      return res.status(404).json({ message: 'No projects found' });
    }

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Route to fetch project details by project ID
router.get('/project/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findByPk(projectId, {
      include: {
        model: Industry,
        as: 'Industry',
      },
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error retrieving project:', error);
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
});

// Route to get academic profile
router.get('/academic/profile', authenticateAndExtractAcademicId, async (req, res) => {
  try {
    // Mock data for academic profile; replace with actual database query as needed
    const academicProfile = {
      academic_id: req.academic_id,
      academic_email: 'academic@example.com',
      role: 'Professor',
      school: 'School of Engineering',
    };
    res.json(academicProfile);
  } catch (error) {
    console.error('Error retrieving academic profile:', error);
    res.status(500).json({ error: 'Failed to retrieve academic profile' });
  }
});

// Route to submit an EOI (Expression of Interest)
router.post('/eoi', async (req, res) => {
  const { industry_id, academic_id, project_id, eoi_date, proposal_description, eoi_status } = req.body;

  try {
    const newEOI = await EOI.create({
      industry_id,
      academic_id,
      project_id,
      eoi_date,
      proposal_description,
      eoi_status,
    });

    res.status(201).json(newEOI);
  } catch (error) {
    console.error('Error submitting EOI:', error);
    res.status(500).json({ error: 'Failed to submit EOI' });
  }
});

// Route to update an existing project
router.put('/editProject/:id', async (req, res) => {
  const { id } = req.params;
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
    const project = await Project.findByPk(id);
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

// Route to manage EOIs for a specific project
router.get('/manageEOIs/:projectId', async (req, res) => {
  const { projectId } = req.params;

  try {
    const eois = await EOI.findAll({ where: { project_id: projectId } });

    if (!eois || eois.length === 0) {
      return res.status(404).json({ message: 'No EOIs found for this project' });
    }

    res.json(eois);
  } catch (error) {
    console.error('Error retrieving EOIs:', error);
    res.status(500).json({ error: 'Failed to retrieve EOIs for the project' });
  }
});

module.exports = router;
