const express = require('express');
const sequelize = require('./config/database'); // Your Sequelize instance
const userRoutes = require('./routes/userRoutes'); // Import user routes
const projectRoutes = require('./routes/projectRoutes'); // Import project routes
const aiSearchRoutes = require('./routes/aiSearchRoutes'); // Import AI search route
const academicRoutes = require('./routes/academicRoutes'); //Import Academic route
const industryRoutes = require('./routes/industryRoutes'); //Import Industry route
const adminRoutes = require('./routes/adminRoutes'); //Import Admin route
const loginRoutes = require('./routes/loginRoutes'); //Import Login route
const academicProfileRoutes = require('./routes/academicProfileRoutes'); //Import academic profile route
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Authenticate and Sync the Database
sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
    return sequelize.sync();
  })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

// Use the user routes
app.use('/api', userRoutes);

// Use the project routes
app.use('/api', projectRoutes);

// Use the AI-specific search routes
app.use('/api', aiSearchRoutes); // AI search routes are also prefixed with /api

// Use the Academic routes
app.use('/api', academicRoutes);

// Use the Industry routes
app.use('/api', industryRoutes);

// Use the Admin routes
app.use('/api', adminRoutes);

// Use the Login routes
app.use('/api', loginRoutes);

// Use the academic profile routes
app.use('/api', academicProfileRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
