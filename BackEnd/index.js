const express = require('express');
const sequelize = require('./config/database'); // Your Sequelize instance
const userRoutes = require('./routes/userRoutes'); // Import user routes
const projectRoutes = require('./routes/projectRoutes'); // Import project routes
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Authenticate and Sync the Database
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
    // Sync the database (this will create the tables if they don't exist)
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Use the user routes
app.use('/api', userRoutes); // All user routes will be prefixed with /api

// Use the project routes
app.use('/api', projectRoutes); // All project routes will be prefixed with /api

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
