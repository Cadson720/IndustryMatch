const SavedProject = require('../models/savedProject');
const Project = require('../models/project');  // Import Project model
const express = require('express');
const router = express.Router();
const { Academic, Industry } = require('../models');

// Save a project to the academic's list
router.post('/project/save', async (req, res) => {
  const { academic_id, project_id } = req.body;

  try {
    // Check if the academic and project exist
    const academic = await Academic.findByPk(academic_id);
    const project = await Project.findByPk(project_id);

    if (!academic || !project) {
      return res.status(404).json({ error: 'Academic or Project not found' });
    }

    // Create a saved project record
    const savedProject = await SavedProject.create({
      academic_id,
      project_id
    });

    res.status(201).json({ message: 'Project saved successfully', savedProject });
  } catch (error) {
    console.error('Error saving project:', error);
    res.status(500).json({ error: 'Failed to save project' });
  }
});

// Get all saved projects for an academic
router.get('/project/saved/:academicId', async (req, res) => {
  const { academicId } = req.params;

  try {
    const savedProjects = await SavedProject.findAll({
      where: { academic_id: academicId },
      include: {
        model: Project,
        include: { model: Industry, as: 'Industry' }  // Ensure 'Industry' alias matches the association
      }
    });

    if (!savedProjects || savedProjects.length === 0) {
      return res.status(404).json({ message: 'No saved projects found for this academic' });
    }

    res.json(savedProjects);
  } catch (error) {
    console.error('Error retrieving saved projects:', error);
    res.status(500).json({ error: 'Failed to retrieve saved projects' });
  }
});

module.exports = router;
