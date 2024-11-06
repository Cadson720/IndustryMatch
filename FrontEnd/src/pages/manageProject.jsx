import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/manageProject.css"; // New CSS file for manage project page

const ManageProject = () => {
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

  // Handle edit button click
  const handleEditClick = (projectId) => {
    navigate(`/editProject/${projectId}`);
  };

  // Handle manage EOIs button click
  const handleManageEOIsClick = (projectId) => {
    navigate(`/manageEOIs/${projectId}`);
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="manage-project-page">
      <h2>Manage Projects</h2>
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
              <button onClick={() => handleEditClick(project.id)} className="edit-button">Edit</button>
              <button onClick={() => handleManageEOIsClick(project.id)} className="eoi-button">Manage EOIs</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageProject;
