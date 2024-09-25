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
              <p><strong>Profession:</strong> {project.profession}</p>
              <p><strong>Location:</strong> {project.location}</p>
              <hr />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Function to filter projects based on the search criteria
  const filteredProjects = projects.filter((project) => {
    const keywordMatch = project.profession.toLowerCase().includes(keywords.toLowerCase()) || project.discipline.toLowerCase().includes(keywords.toLowerCase());
    const fieldMatch = field ? project.discipline === field : true;
    const durationMatch = duration ? project.duration === duration : true;
    const locationMatch = location ? project.location === location : true;
    const industryMatch = industry ? project.industry === industry : true;
    const sizeMatch = size ? project.size === size : true;

    // Return true if all conditions match
    return keywordMatch && fieldMatch && durationMatch && locationMatch && industryMatch && sizeMatch;
  });

  // Display the first matching project if search criteria are provided
  const project = filteredProjects[0]; // Get the first matching project

  if (!project) {
    return <p>No matching project found.</p>; // If no project matches the criteria
  }

  return (
    <div>
      <h1>Project Details</h1>
      <ul>
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
      </ul>
    </div>
  );
}

export default ProjectList;
