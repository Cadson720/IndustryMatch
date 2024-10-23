import React, { useState } from 'react';

const CreateIndustryUser = () => {
  const [userDetails, setUserDetails] = useState({
    industry_email: '',
    industry_discipline: '',
    organisation: '',
    industry_password: ''
  });
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({
      ...userDetails,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const token = localStorage.getItem('jwtToken'); // Assume the JWT token is stored in local storage
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:3000/api/industry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send the JWT token in the Authorization header
        },
        body: JSON.stringify(userDetails) // Send the new industry user details in the request body
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setSuccessMessage('Industry user created successfully!');
      console.log('Created user:', data);

      // Reset form fields after successful creation
      setUserDetails({
        industry_email: '',
        industry_discipline: '',
        organisation: '',
        industry_password: ''
      });
    } catch (error) {
      console.error('Error creating industry user:', error);
      setError('Failed to create industry user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-industry-container">
      <h2>Create New Industry User</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          name="industry_email"
          value={userDetails.industry_email}
          onChange={handleInputChange}
          required
        />

        <label>Industry Discipline:</label>
        <input
          type="text"
          name="industry_discipline"
          value={userDetails.industry_discipline}
          onChange={handleInputChange}
          required
        />

        <label>Organisation:</label>
        <input
          type="text"
          name="organisation"
          value={userDetails.organisation}
          onChange={handleInputChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="industry_password"
          value={userDetails.industry_password}
          onChange={handleInputChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Industry User'}
        </button>
      </form>
    </div>
  );
};

export default CreateIndustryUser;
