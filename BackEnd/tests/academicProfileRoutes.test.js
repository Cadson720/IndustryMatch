const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const { Academic } = require('../models'); // Adjust the path as necessary
const academicRouter = require('../routes/academicProfileRoutes');

// Mock JWT secret key
const jwtSecret = 'your_secret_key';

// Mock data
const mockAcademic = {
  academic_email: 'test@example.com',
  role: 'Professor',
  school: 'Test University',
};

// Mock JWT payload
const mockJwtPayload = {
  profile: {
    academic_id: 1,
  },
};

// Set up the Express app with the router
const app = express();
app.use(express.json());
app.use('/api', academicRouter);

// Mock `jwt.verify`
jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn(),
}));

// Mock the `Academic` model
jest.mock('../models', () => ({
  Academic: {
    findByPk: jest.fn(),
  },
}));

describe('Academic Profile API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/academic/profile', () => {
    it('should return the academic profile for a valid token', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockJwtPayload);
      });

      Academic.findByPk.mockResolvedValue(mockAcademic);

      const response = await request(app)
        .get('/api/academic/profile')
        .set('Authorization', `Bearer valid_token`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAcademic);
      expect(Academic.findByPk).toHaveBeenCalledWith(mockJwtPayload.profile.academic_id, {
        attributes: ['academic_email', 'role', 'school'],
      });
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).get('/api/academic/profile');

      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: 'Unauthorized: No token provided' });
    });

    it('should return 403 if token is invalid', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error('Invalid token'));
      });

      const response = await request(app)
        .get('/api/academic/profile')
        .set('Authorization', `Bearer invalid_token`);

      expect(response.status).toBe(403);
      expect(response.body).toEqual({ error: 'Forbidden: Invalid or expired token' });
    });

    it('should return 404 if academic user is not found', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockJwtPayload);
      });

      Academic.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/academic/profile')
        .set('Authorization', `Bearer valid_token`);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Academic user not found' });
    });
  });

  describe('PUT /api/academic/profile', () => {
    const updatedData = {
      academic_email: 'updated@example.com',
      role: 'Associate Professor',
      school: 'Updated University',
    };

    it('should update and return the academic profile for a valid token', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockJwtPayload); // Mock the decoded JWT payload
      });

      // Mock the Academic instance and its save method
      const mockAcademicInstance = {
        ...mockAcademic,
        save: jest.fn().mockImplementation(function() {
          this.academic_email = updatedData.academic_email;
          this.role = updatedData.role;
          this.school = updatedData.school;
          return Promise.resolve(this);  // Return the updated instance
        }),
      };

      Academic.findByPk.mockResolvedValue(mockAcademicInstance);

      const response = await request(app)
        .put('/api/academic/profile')
        .set('Authorization', `Bearer valid_token`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedData);
      expect(Academic.findByPk).toHaveBeenCalledWith(mockJwtPayload.profile.academic_id);
      expect(mockAcademicInstance.save).toHaveBeenCalled();
    });

    it('should return 404 if academic user is not found', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockJwtPayload);
      });

      Academic.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .put('/api/academic/profile')
        .set('Authorization', `Bearer valid_token`)
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Academic user not found' });
    });

    it('should return 500 if there is a server error', async () => {
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, mockJwtPayload);
      });

      Academic.findByPk.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/academic/profile')
        .set('Authorization', `Bearer valid_token`)
        .send(updatedData);

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: 'Failed to update academic profile' });
    });
  });
});
