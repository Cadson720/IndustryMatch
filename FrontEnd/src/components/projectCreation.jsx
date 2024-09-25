import React, { useState } from 'react';

function CreateProject() {
  // Helper function to format date to YYYY-MM-DD
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // This will give you the date in YYYY-MM-DD format
  };

  // State to store form inputs, initialize publishDate with today's date
  const [formData, setFormData] = useState({
    title: '',
    publishDate: getTodayDate(),  // Set today's date as default
    discipline: '',
    duration: '',
    size: '',
    industry: '',
    location: ''
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send the POST request to your backend API
      const response = await fetch('http://localhost:3000/api/project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Success case
        setSuccess(true);
        setFormData({
          title: '',
          publishDate: getTodayDate(), // Reset the form with today's date again
          discipline: '',
          duration: '',
          size: '',
          industry: '',
          location: ''
        });
      } else {
        // Handle errors from the server
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create project');
      }
    } catch (err) {
      setError('Something went wrong while creating the project');
    }
  };

  return (
    <div>
      <h1>Create a New Project</h1>

      {success && <p>Project created successfully!</p>}
      {error && <p>Error: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label>Publish Date:</label>
          <input type="date" name="publishDate" value={formData.publishDate} onChange={handleChange} required />
        </div>
        <div>
          <label>Discipline:</label>
          <input type="text" name="discipline" value={formData.discipline} onChange={handleChange} required />
        </div>
        <div>
          <label>Duration:</label>
          <input type="text" name="duration" value={formData.duration} onChange={handleChange} required />
        </div>
        <div>
          <label>Size:</label>
          <input type="text" name="size" value={formData.size} onChange={handleChange} required />
        </div>
        <div>
          <label>Industry:</label>
          <select name="industry" value={formData.industry} onChange={handleChange} required>
            <option value="">Select Industry</option>
            <option value="Analytics and Data Science">Analytics and Data Science</option>
            <option value="Business">Business</option>
            <option value="Communication">Communication</option>
            <option value="Engineering">Engineering</option>
            {/* Add other industry options as needed */}
          </select>
        </div>
        <div>
          <label>Location:</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} required />
        </div>
        <button type="submit">Create Project</button>
      </form>
    </div>
  );
}

export default CreateProject;
