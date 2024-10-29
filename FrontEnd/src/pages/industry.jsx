import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/industry.css"; 
import FeaturedProjects from './featuredProject';

const Industry = () => {
  const navigate = useNavigate();

  const handleCreateProject = () => {
    navigate('/projectCreation');
  };

  const handleViewProjects = () => {
    navigate('/industryProfile');
  };

  return (
    <div className="industry-container">
      <div className="left-column">
        <FeaturedProjects />
      </div>
      <div className="right-column">
        <div className="backdrop"></div>
        <div className="text-row">
          <div className="text top-row">
            <img src="/send_icon.png" alt="Image" className="image" />
            Post your own Projects
          </div>
          <button onClick={handleCreateProject} className="nav-button">Create Project</button>
          <div className="separator"></div>
          <div className="text bottom-row">
            <img src="/MatchMaker.png" alt="Image" className="image" />
            View Your Projects and Applications
          </div>
          <button onClick={handleViewProjects} className="nav-button">Here</button>
        </div>
      </div>
    </div>
  );
}

export default Industry;
