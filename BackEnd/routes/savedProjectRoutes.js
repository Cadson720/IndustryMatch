import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';
import "../styles/savedProject.css";

const SavedProject = () => {
  const [projects, setProjects] = useState([]);
  const [userDetails, setUserDetails] = useState({
    academic_id: null,
    email: '',
    role: '',
    school: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch the academic profile to get academic_id
  useEffect(() => {
    const fetchAcademicProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
          },
        });

        if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();

        setUserDetails({
          academic_id: data.academic_id,
          email: data.academic_email,
          role: data.role,
          school: data.school,
        });
      } catch (error) {
        console.error('Error fetching academic profile:', error);
        setError('Failed to fetch academic profile');
      }
    };

    fetchAcademicProfile();
  }, []);

  // Fetch saved projects once academic_id is available in userDetails
  useEffect(() => {
    if (!userDetails.academic_id) return;

    const fetchSavedProjects = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/saved/${userDetails.academic_id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) throw new Error('Failed to fetch saved projects');
        
        const data = await response.json();
        
        setProjects(data);
      } catch (error) {
        console.error('Error fetching saved projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, [userDetails.academic_id]);

  // Function to handle unsaving a project
  const unsaveProject = async (projectId) => {
    const token = localStorage.getItem('jwtToken');
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/project/saved/${userDetails.academic_id}/${projectId}`;
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to unsave project');

      // Update the projects state to remove the unsaved project
      setProjects(projects.filter(savedProject => savedProject.Project.project_id !== projectId));
      alert('Project unsaved successfully!');
    } catch (error) {
      console.error('Error unsaving project:', error);
      alert('Failed to unsave project.');
    }
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="save-project-page">
      <Header />
      <div className="save-project-details">
        <h2>Saved Projects</h2>
        <div className="save-project-container">
          {projects.length === 0 ? (
            <div className="no-projects-message">
              <p>No saved projects available.</p>
            </div>
          ) : (
            projects.map((savedProject) => (
              <div key={savedProject.Project.project_id} className="project-card">
                <h3>{savedProject.Project.title}</h3>
                <p><strong>Industry:</strong> {savedProject.Project.industry} - {savedProject.Project.discipline}</p>
                <p><img src="/clock.png" alt="Duration icon" className="icon" /> {savedProject.Project.duration}</p>
                <p><img src="/location.png" alt="Location icon" className="icon" /> {savedProject.Project.location_type}</p>
                <p className="description">{savedProject.Project.description.slice(0, 100)}...</p>
                <button onClick={() => navigate(`/projectDetail/${savedProject.Project.project_id}`)} className="view-button">View</button>
                <button 
                  onClick={() => unsaveProject(savedProject.Project.project_id)} 
                  className="unsave-button"
                >
                  Unsave
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SavedProject;
