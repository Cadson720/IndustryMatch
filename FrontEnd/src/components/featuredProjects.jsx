import React, { useState, useEffect } from 'react';
import "../styles/featuredProjects.css"; // Import the CSS for this component

const FeaturedProjects = () => {
  const [featuredProject, setFeaturedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the first featured project from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/api/featured-projects') // Ensure this endpoint returns the projects
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        // Set the first project as the featured project
        if (data.length > 0) {
          setFeaturedProject(data[0]); // Get the first project
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="featured-projects-container">
      {featuredProject ? (
        <div className="featured-project-box">
          <h3>{featuredProject.title}</h3>
          <p>{featuredProject.description}</p>
        </div>
      ) : (
        <p>No featured project available.</p>
      )}
    </div>
  );
};

export default FeaturedProjects;
