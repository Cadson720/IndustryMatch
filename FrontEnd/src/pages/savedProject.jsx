import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/savedProject.css"; // New CSS file for manage project page

const SavedProject = () => {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch projects for the logged-in industry user
  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch('http://localhost:3000/api/project', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await response.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
      }
    };
    fetchProjects();
  }, []);

  

  const handleViewClick = (projectId) => {
    navigate(`/projectDetail/${projectId}`);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="manage-project-page">
      <h2>Saved Projects</h2>
      <div className="manage-project-container">
        {projects.map((project) => (
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
            <div className="project-actions">
                <button onClick={() => handleViewClick(project.id)} className="view-button">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProject;
