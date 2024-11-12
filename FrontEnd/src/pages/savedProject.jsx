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
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());

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
            'Authorization': `Bearer ${token}`,
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

  // Fetch saved projects and populate savedProjectIds
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
        
        // Populate projects and savedProjectIds
        setProjects(data);
        setSavedProjectIds(new Set(data.map((project) => project.Project.project_id)));
      } catch (error) {
        console.error('Error fetching saved projects:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedProjects();
  }, [userDetails.academic_id]);

  // Function to handle saving a project
  const saveProject = async (projectId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ academic_id: userDetails.academic_id, project_id: projectId })
      });

      if (!response.ok) throw new Error('Failed to save project');

      setSavedProjectIds(new Set(savedProjectIds).add(projectId));
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project.');
    }
  };

  // Function to handle unsaving a project and remove it from the displayed list
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

      const newSavedIds = new Set(savedProjectIds);
      newSavedIds.delete(projectId);
      setSavedProjectIds(newSavedIds);

      setProjects(projects.filter(savedProject => savedProject.Project.project_id !== projectId));
      
      alert('Project unsaved successfully!');
    } catch (error) {
      console.error('Error unsaving project:', error);
      alert('Failed to unsave project.');
    }
  };

  const handleApplyClick = (projectId) => {
    navigate(`/projectDetail/${projectId}`);
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
                
                <div className="actions">
                  {/* Apply Button with consistent functionality */}
                  <button 
                    onClick={() => navigate(`/projectDetail?projectId=${savedProject.Project.project_id}`)} 
                    className="apply-button"
                  >
                    Apply
                  </button>


                  {/* Conditionally Render Save or Unsave Button */}
                  {savedProjectIds.has(savedProject.Project.project_id) ? (
                    <button 
                      onClick={() => unsaveProject(savedProject.Project.project_id)} 
                      className="unsave-button"
                    >
                      Unsave
                    </button>
                  ) : (
                    <button 
                      onClick={() => saveProject(savedProject.Project.project_id)} 
                      className="save-button"
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );  
};

export default SavedProject;
