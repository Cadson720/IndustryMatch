const express = require('express');
const router = express.Router();
const { User } = require('../models');

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
});

// POST route to add a new user
router.post('/users', async (req, res) => {
  try {
    const { username, email, phno } = req.body;  // Get data from request body
    const newUser = await User.create({ username, email, phno });  // Create a new user
    res.status(201).json(newUser);  // Send the new user as a response
  } catch (err) {
    res.status(500).json({ error: 'Failed to add user' });
  }
});

// PUT route to edit an existing user
router.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;  // Get user id from the URL
    const { username, email, phno } = req.body;  // Get new data from the request body

    const user = await User.findByPk(id);  // Find the user by id
    if (user) {
      user.username = username;
      user.email = email;
      user.phno = phno;
      await user.save();  // Save the updated user
      res.status(200).json(user);  // Return the updated user
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit user' });
  }
});


module.exports = router;
