import React, { useState, useEffect } from 'react';

function ProjectList({ keywords, field, duration, location, industry, size }) {
  const [projects, setProjects] = useState([]);  // State to hold the projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Sort the data by project_id in ascending order
        const sortedData = data.sort((a, b) => a.project_id - b.project_id);
        setProjects(sortedData);  // Set the sorted project data
        setLoading(false);   // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);     // Set error
        setLoading(false);   // Stop loading even if there's an error
      });
  }, []);

  // If still loading, show a loading message
  if (loading) return <p>Loading...</p>;

  // If there's an error, display it
  if (error) return <p>Error: {error.message}</p>;

  // If no search criteria provided, display all projects
  if (!keywords && !field && !duration && !location && !industry && !size) {
    return (
      <div>
        <h1>All Projects (Sorted by Project ID)</h1>
        <ul>
          {projects.map((project) => (
            <li key={project.project_id}>
              <p><strong>Project ID:</strong> {project.project_id}</p>
              <p><strong>Publish Date:</strong> {new Date(project.publish_date).toLocaleDateString()}</p>
              <p><strong>Industry:</strong> {project.industry}</p>
              <p><strong>Duration:</strong> {project.duration}</p>
              <p><strong>Size:</strong> {project.size}</p>
              <p><strong>Location Type:</strong> {project.location_type}</p>
              <p><strong>Title:</strong> {project.title}</p>
              <p><strong>Discipline:</strong> {project.discipline}</p>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Status:</strong> {project.status}</p>
              <p><strong>Image Path:</strong> {project.image_path}</p>
              <p><strong>Address:</strong> {project.address}</p>

              {/* Display associated Industry (member) information if available */}
              {project.Industry && (
                <div>
                  <h3>Industry Info</h3>
                  <p><strong>Email:</strong> {project.Industry.industry_email}</p>
                  <p><strong>Organisation:</strong> {project.Industry.organisation}</p>
                  <p><strong>Discipline:</strong> {project.Industry.industry_discipline}</p>
                </div>
              )}
              <hr />
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return null;
}

export default ProjectList;
