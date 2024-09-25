import React, { useState, useEffect } from 'react';

function ProjectDisplay() {
  const [projects, setProjects] = useState([]);  // State to hold the projects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend for projects
    fetch('http://localhost:3000/api/project')
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

  // Display the fetched projects data
  return (
    <div>
      <h1>Project List</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.ProjectID}>
            <p><strong>Project ID:</strong> {project.ProjectID}</p>
            <p><strong>Member ID:</strong> {project.MemberID}</p>
            <p><strong>Publish Date:</strong> {new Date(project.publishDate).toLocaleDateString()}</p>
            <p><strong>Discipline:</strong> {project.discipline}</p>
            <p><strong>Duration:</strong> {project.duration}</p>
            <p><strong>Size:</strong> {project.size}</p>
            <p><strong>Profession:</strong> {project.profession}</p>
            <p><strong>Location:</strong> {project.location}</p>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProjectDisplay;
