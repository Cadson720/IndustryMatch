import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/loader.css";
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';
import "../styles/savedProject.css"; // New CSS file for save project page

const SavedProject = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch projects for the logged-in user with a delay
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        // Introduce a delay of 250ms using setTimeout
        setTimeout(() => {
          setProjects(data);
          setLoading(false); // Set loading to false once the data is fetched and delayed
        }, 250);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };
    fetchProjects();
  }, []);

  const handleViewClick = (projectID) => {
    navigate(`/projectDetail/${projectID}`);
  };

  if (loading) return <Loader />; // Display the loader while loading
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="save-project-page">
      {!loading && <Header />}
      <div className="save-project-details">
        <h2>Saved Projects</h2>
        <div className="save-project-container">
          {projects.length === 0 ? (
            <div className="no-projects-message">
              <p>No saved projects available.</p>
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="project-card">
                <h3>{project.title}</h3>
                <p><strong>Industry:</strong> {project.industry} - {project.discipline}</p>
                <p>
                  <img src="/clock.png" alt="Duration icon" className="icon" />
                  {project.duration}
                </p>
                <p>
                  <img src="/location.png" alt="Location icon" className="icon" />
                  {project.location_type}
                </p>
                <p className="description">{project.description.slice(0, 100)}...</p>
                {/* <div className="project-actions">
                  <button onClick={() => handleViewClick(project.id)} className="view-button">View</button>
                </div> */}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedProject;
