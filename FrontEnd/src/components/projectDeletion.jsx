import React, { useState, useEffect } from 'react';
import '../styles/DeleteProjectList.css'; // Import CSS file for stylin

function DeleteProjectList() {
  const [projects, setProjects] = useState([]);  // State to hold the projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProjects, setSelectedProjects] = useState([]); // State for selected projects

  useEffect(() => {
    // Fetch data from the backend for projects
    fetch('http://localhost:3000/api/project') // Fetch data from the updated route
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data);  // Set the fetched project data
        setLoading(false);   // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);     // Set error
        setLoading(false);   // Stop loading even if there's an error
      });
  }, []);

  // Function to handle project selection by clicking the entire card
  const handleSelect = (projectId) => {
    setSelectedProjects((prevSelected) => {
      if (prevSelected.includes(projectId)) {
        return prevSelected.filter((id) => id !== projectId); // Deselect if already selected
      } else {
        return [...prevSelected, projectId]; // Add to selected projects
      }
    });
  };

  // Function to delete selected projects
  const handleDelete = () => {
    selectedProjects.forEach((projectId) => {
      fetch(`http://localhost:3000/api/project/${projectId}`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to delete project');
          }
          // Update the projects list after deletion
          setProjects((prevProjects) =>
            prevProjects.filter((project) => project.ProjectID !== projectId)
          );
        })
        .catch((error) => console.error('Error deleting project:', error));
    });

    // Clear selected projects after deletion
    setSelectedProjects([]);
  };

  // If still loading, show a loading message
  if (loading) return <p>Loading...</p>;

  // If there's an error, display it
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="delete-project-list">
      <h1>Delete Projects</h1>
      {projects.length === 0 ? (
        <p>No projects available</p>
      ) : (
        <div className="project-list">
          {projects.map((project) => (
            <div
              key={project.ProjectID}
              className={`project-card ${selectedProjects.includes(project.ProjectID) ? 'selected' : ''}`}
              onClick={() => handleSelect(project.ProjectID)}
            >
              <strong>Project ID:</strong> {project.ProjectID} <br />
              <strong>Title:</strong> {project.title} <br />
              <strong>Duration:</strong> {project.duration} <br />
              <strong>Industry:</strong> {project.industry}
            </div>
          ))}
        </div>
      )}
      <button
        className="delete-button"
        onClick={handleDelete}
        disabled={selectedProjects.length === 0}
      >
        Delete Selected Projects
      </button>
    </div>
  );
}

export default DeleteProjectList;
