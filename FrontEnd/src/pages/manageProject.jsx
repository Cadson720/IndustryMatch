import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/loader.css";
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';
import "../styles/manageProject.css";

const ManageProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/project/industry`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.status === 404) {
          setProjects([]);
          setFilteredProjects([]);
        } else if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        } else {
          const data = await response.json();
          setTimeout(() => {
            setProjects(data);
            setFilteredProjects(data);
            setLoading(false);
          }, 250);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(query) ||
      project.industry.toLowerCase().includes(query) ||
      project.discipline.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  const handleEditClick = (projectId) => {
    navigate(`/editProject/${projectId}`);
  };

  const handleManageEOIsClick = (projectId) => {
    navigate(`/manageEOI/${projectId}`);
  };

  const handleDeleteClick = (projectId) => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found. Please log in.');
      return;
    }

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/${projectId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete project');
        }
        setProjects((prevProjects) =>
          prevProjects.filter((project) => project.project_id !== projectId)
        );
        setFilteredProjects((prevProjects) =>
          prevProjects.filter((project) => project.project_id !== projectId)
        );
      })
      .catch((error) => console.error('Error deleting project:', error));
  };

  const statusColor = (status) => {
    switch (status) {
      case 'Public':
        return '#4caf50'; // Green for Public
      case 'Private':
        return '#ff9800'; // Orange for Private
      case 'Archived':
      default:
        return '#f44336'; // Red for Archived
    }
  };

  if (loading) return <Loader />;
  if (error) return <p className="error-message">Error: {error}</p>;

  return (
    <div className="manage-project-page">
      {!loading && <Header />}
      <div className="manage-project-container">
        <h2>Manage Projects</h2>
        <input
          type="text"
          className="search-bar-manage"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="project-cards">
          {filteredProjects.length === 0 ? (
            <div className="no-projects-message">
              <p>No projects found.</p>
              <button className="create-project-button" onClick={() => navigate('/projectCreation')}>
                Create a New Project
              </button>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.project_id} className="project-card">
                <div
                  className="status-color-band"
                  style={{ backgroundColor: statusColor(project.status) }}
                ></div>
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
                <p className="description">{project.description.slice(0, 90)}...</p>
                <div className="project-actions">
                  <button onClick={() => handleEditClick(project.project_id)} className="edit-button">Edit</button>
                  <button onClick={() => handleManageEOIsClick(project.project_id)} className="eoi-button">Manage EOIs</button>
                  <button onClick={() => handleDeleteClick(project.project_id)} className="delete-button">Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageProject;
