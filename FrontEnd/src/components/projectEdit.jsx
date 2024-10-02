import React, { useState, useEffect } from 'react';

function EditProjectList() {
  const [projects, setProjects] = useState([]);  // State to hold the list of projects
  const [selectedProject, setSelectedProject] = useState(null);  // State to hold the selected project
  const [formData, setFormData] = useState({
    title: '',
    duration: '',
    industry: '',
    location: '',
    size: ''
  });
  const [loading, setLoading] = useState(true);  // Loading state for fetching projects
  const [error, setError] = useState(null);      // Error state

  useEffect(() => {
    // Fetch all projects
    fetch('http://localhost:3000/api/project')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);   // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);   // Stop loading if there's an error
      });
  }, []);

  const handleSelectProject = (project) => {
    // When a project is selected, populate the form with its current details
    setSelectedProject(project);
    setFormData({
      title: project.title,
      duration: project.duration,
      industry: project.industry,
      location: project.location,
      size: project.size
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    // Send updated project data to the backend
    fetch(`http://localhost:3000/api/project/${selectedProject.ProjectID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update project');
        }
        return response.json();
      })
      .then((updatedProject) => {
        // Update the project list with the edited project data
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.ProjectID === updatedProject.ProjectID ? updatedProject : proj
          )
        );
        setSelectedProject(null); // Reset the selected project
      })
      .catch((error) => {
        console.error('Error updating project:', error);
      });
  };

  // If loading, show a loading message
  if (loading) return <p>Loading projects...</p>;

  // If there's an error, display the error
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Edit Projects</h1>
      <div>
        <h2>Select a project to edit</h2>
        <ul>
          {projects.map((project) => (
            <li
              key={project.ProjectID}
              onClick={() => handleSelectProject(project)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedProject?.ProjectID === project.ProjectID ? '#d0f0c0' : 'white',
                padding: '10px',
                margin: '5px',
                border: '1px solid #ccc',
              }}
            >
              <strong>Project ID:</strong> {project.ProjectID} <br />
              <strong>Title:</strong> {project.title}
            </li>
          ))}
        </ul>
      </div>

      {selectedProject && (
        <div>
          <h2>Edit Project Details</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Duration:</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Industry:</label>
              <input
                type="text"
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Location:</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label>Size:</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default EditProjectList;
