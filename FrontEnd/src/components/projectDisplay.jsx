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
        setProjects(data);  // Set the fetched project data
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
        <h1>All Projects</h1>
        <ul>
          {projects.map((project) => (
            <li key={project.ProjectID}>
              <p><strong>Project ID:</strong> {project.ProjectID}</p>
              <p><strong>Member ID:</strong> {project.MemberID}</p>
              <p><strong>Publish Date:</strong> {new Date(project.publishDate).toLocaleDateString()}</p>
              <p><strong>Discipline:</strong> {project.discipline}</p>
              <p><strong>Duration:</strong> {project.duration}</p>
              <p><strong>Size:</strong> {project.size}</p>
              <p><strong>Industry:</strong> {project.industry}</p>
              <p><strong>Location:</strong> {project.location}</p>
              <p><strong>Title:</strong> {project.title}</p>

              
              {/* Display associated member (Industry) information if available */}
              {project.Industry && (
                <div>
                  <h3>Member Info</h3>
                  <p><strong>Email:</strong> {project.Industry.email}</p>
                  <p><strong>Organisation:</strong> {project.Industry.organisation}</p>
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