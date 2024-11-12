const request = require('supertest');
const express = require('express');
const { Admin } = require('../models'); // Adjust the path as necessary
const adminRouter = require('../routes/adminRoutes'); // Adjust the path as necessary

// Set up the Express app with the router
const app = express();
app.use(express.json());
app.use('/api', adminRouter);

// Mock the Admin model
jest.mock('../models', () => ({
  Admin: {
    findAll: jest.fn(),
  },
}));

describe('GET /api/admin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return all admin users', async () => {
    const mockAdminData = [
      { id: 1, name: 'Admin1', email: 'admin1@example.com' },
      { id: 2, name: 'Admin2', email: 'admin2@example.com' },
    ];

    Admin.findAll.mockResolvedValue(mockAdminData);

    const response = await request(app).get('/api/admin');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAdminData);
    expect(Admin.findAll).toHaveBeenCalledTimes(1);
  });

  it('should return a 500 error if there is a server error', async () => {
    // Mock Admin.findAll to throw an error
    Admin.findAll.mockRejectedValue(new Error('Database error'));

    const response = await request(app).get('/api/admin');

    expect(response.status).toBe(500);  // Check for server error response
    expect(response.body).toEqual({ error: 'Error retrieving admin' });  // Check for the expected error message
    expect(Admin.findAll).toHaveBeenCalledTimes(1);  // Ensure Admin.findAll was called once
  });
});
