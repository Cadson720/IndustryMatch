import React, { useState } from 'react';

const SavedProjects = () => {
  const [academicId, setAcademicId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [savedProjects, setSavedProjects] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Save a project to the academic's saved project list
  const saveProject = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/project/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ academic_id: academicId, project_id: projectId }),  // Send academic_id and project_id
      });

      if (!response.ok) {
        throw new Error('Failed to save project');
      }

      const data = await response.json();
      setSuccessMessage('Project saved successfully');  // Show success message
      setError(null);  // Clear any errors
    } catch (err) {
      setError(err.message);  // Set error if something goes wrong
      setSuccessMessage(null);  // Clear any success messages
    }
  };

  // Handle fetching saved projects
  const handleFetchSubmit = (e) => {
    e.preventDefault();
    if (academicId.trim() === '') {
      setError('Academic ID is required to fetch saved projects');
      return;
    }
    fetchSavedProjects();
  };

  // Handle saving a project to the academic
  const handleSaveSubmit = (e) => {
    e.preventDefault();
    if (academicId.trim() === '' || projectId.trim() === '') {
      setError('Both Academic ID and Project ID are required to save a project');
      return;
    }
    saveProject();
  };

  return (
    <div>
      <h1>Saved Projects for Academic</h1>

      {/* Form to input Academic ID and fetch saved projects */}
      <form onSubmit={handleFetchSubmit}>
        <input
          type="text"
          placeholder="Enter Academic ID"
          value={academicId}
          onChange={(e) => setAcademicId(e.target.value)}  // Update academicId state
        />
        <button type="submit">Fetch Saved Projects</button>
      </form>

      {/* Form to save a new project */}
      <form onSubmit={handleSaveSubmit}>
        <h3>Save a Project</h3>
        <input
          type="text"
          placeholder="Enter Academic ID"
          value={academicId}
          onChange={(e) => setAcademicId(e.target.value)}  // Update academicId state
        />
        <input
          type="text"
          placeholder="Enter Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}  // Update projectId state
        />
        <button type="submit">Save Project</button>
      </form>

      {/* Display success or error messages */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

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

export default SavedProjects;
