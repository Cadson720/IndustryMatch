import React, { useEffect, useState } from 'react';
import "../styles/featuredProjects.css";

const FeaturedProjects = () => {
  // State to store the fetched projects
  const [projects, setProjects] = useState([]);

  const getPreviewDescription = (description) => {
    const cutOffIndex = description.indexOf('Project Objectives:');
    return cutOffIndex > -1 ? description.substring(0, cutOffIndex) : description;
  };

  // Fetch data when the component mounts
  useEffect(() => {
    // Fetch all projects from the API
    fetch('http://localhost:3000/api/project')
      .then((response) => response.json())
      .then((data) => {
        // Take only the first 3 projects
        const featuredProjects = data.slice(0, 3);
        setProjects(featuredProjects);
      })
      .catch((error) => {
        console.error('Error fetching featured projects:', error);
      });
  }, []);

  return (
    <div className="featured-projects-container">
      <h2>Featured Projects</h2>
      <div className="featured-projects">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project.id} className="project-box">
              <h3>{project.title}</h3>
              <p>
                <em>{getPreviewDescription(project.description).slice(0, -2)}..</em>
              </p>
            </div>
          ))
        ) : (
          <p>No featured projects to display</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedProjects;
