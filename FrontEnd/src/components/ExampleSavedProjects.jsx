import React, { useState } from 'react';

const SavedProjectsExample = () => {
  const [academicId, setAcademicId] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [error, setError] = useState(null);

  // Fetch saved projects for the given academic ID
  const fetchSavedProjects = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/project/saved/${academicId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch saved projects');
      }

      const data = await response.json();
      setSavedProjects(data);  // Update the state with the fetched projects
      setError(null);  // Clear any previous errors
    } catch (err) {
      setError(err.message);  // Set error message if fetch fails
      setSavedProjects([]);  // Clear previous data if fetch fails
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (academicId.trim() === '') {
      setError('Academic ID is required');
      return;
    }
    fetchSavedProjects();  // Trigger the API call
  };

  return (
    <div>
      <h1>Saved Projects for Academic</h1>

      {/* Form to input Academic ID */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Academic ID"
          value={academicId}
          onChange={(e) => setAcademicId(e.target.value)}  // Update academicId state
        />
        <button type="submit">Fetch Saved Projects</button>
      </form>

      {/* Display error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Display saved projects */}
      <div>
        <h3>Saved Projects List</h3>
        {savedProjects.length > 0 ? (
          <ul>
            {savedProjects.map((project) => (
              <li key={project.saved_project_id}>
                <strong>Project Title:</strong> {project.Project.title} <br />
                <strong>Industry:</strong> {project.Project.Industry?.industry_email || 'N/A'} <br />
                <strong>Discipline:</strong> {project.Project.discipline || 'N/A'}
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved projects found</p>
        )}
      </div>
    </div>
  );
};

export default SavedProjectsExample;
