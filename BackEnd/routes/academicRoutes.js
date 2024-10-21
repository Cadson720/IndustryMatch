const express = require('express');
const router = express.Router();
const { Academic } = require('../models'); // Ensure Academic model are imported



//Get all Academic users
router.get('/academic', async (req, res) => {
  console.log('get all academic users')
  try {
    const academics = await Academic.findAll();
    res.json(academics);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving academics' });
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



/*
//Check if academic exists
router.get('/academic/:academic_email', async (req, res) => {
  const email = req.params;
  console.log(email)
  try {
    const foundAcademic = await Academic.findOne({ academic_email: email});
    if (!foundAcademic) {
      return res.status(404).json({ error: 'Academic does not exist' });
    }
    else{
      res.redirect('/src/html-pages/projectSearch.html')
    }
    res.status(204).send(); // Send 204 No Content response after deletion
  } catch (error) {
    console.error('Error finding academic:', error);
    res.status(500).json({ error: 'Failed to find academic' });
  }
});



// Route to create a new academic
router.post('/academic', async (req, res) => {
  try {
    const newAcademic = await Academic.create(req.body);
    res.status(201).json(newAcademic);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create academic' });
  }
});*/

module.exports = router;
