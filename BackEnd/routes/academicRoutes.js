const express = require('express');
const router = express.Router();
const { Academic } = require('../models'); // Ensure Academic model are imported



//Get all Academic users
router.get('/academics', async (req, res) => {
  try {
    const users = await Academic.findAll();
    res.json(academics);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving academics' });
  }
});

//Get Academic user by ID
router.get('/academics/:academic_id', async (req, res) => {
  try {
    const { id } = req.params;  // Get the user ID from the URL
    const academic = await Academic.findByPk(id);  // Fetch user by primary key (id)
    console.log(`Fetching academic with ID: ${id}`);  // Log the ID being fetched
    if (academic) {
      res.json(academic);
    } else {
      res.status(404).json({ error: 'Academic not found' });
    }
  } catch (error) {
    console.error('Error fetching academic:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Check if academic exists
router.get('/academic/:academic_email', async (req, res) => {
  const { email } = req.params;
  const { password } = req.params;
  console.log(email)
  try {
    const foundAcademic = await Academic.findOne({ academic_email: email });
    if (!foundAcademic) {
      return res.status(404).json({ error: 'Academic does not exist' });
    }
    res.status(204).send(); // Send 204 No Content response after deletion
  } catch (error) {
    console.error('Error finding academic:', error);
    res.status(500).json({ error: 'Failed to find academic' });
  }
});

//Add an academic User
router.post('/academics', async (req, res) => {
  try {
    const { academic_email, academic_password, school, role } = req.body;  // Get data from request body
    const newAcademic = await Academic.create({ academic_email, academic_password, school, role });  // Create a new user
    res.status(201).json(newAcademic);  // Send the new user as a response
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

module.exports = router;
