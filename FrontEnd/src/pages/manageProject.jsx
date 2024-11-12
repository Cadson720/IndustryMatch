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
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch projects for the logged-in industry user with a delay
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
          // Introduce a delay of 250ms using setTimeout
          setTimeout(() => {
            setProjects(data);
            setFilteredProjects(data); // Set initial filtered projects
            setLoading(false); // Set loading to false once data is fetched and delayed
          }, 250);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error.message);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchProjects();
  }, []);

  // Handle search query change
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter projects based on the search query
    const filtered = projects.filter((project) =>
      project.title.toLowerCase().includes(query) ||
      project.industry.toLowerCase().includes(query) ||
      project.discipline.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query)
    );
    setFilteredProjects(filtered);
  };

  // Handle edit button click
  const handleEditClick = (projectId) => {
    navigate(`/editProject/${projectId}`);
  };

  // Handle manage EOIs button click
  const handleManageEOIsClick = (projectId) => {
    navigate(`/manageEOI/${projectId}`);
  };

  // Handle delete button click
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

  if (loading) return <Loader />; // Display the Loader while loading
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="manage-project-page">
      {!loading && <Header />} {/* Render Header only when not loading */}
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
