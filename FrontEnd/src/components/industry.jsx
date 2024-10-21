import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import "../styles/industry.css"; 


const Industry = () => {
  return (
    <div className="industry-container">
      <div className="left-column">
        <div className="title-text">Featured Projects</div>
      </div>
      <div className="right-column">
        <div className="backdrop"></div>
        <div className="text-row">
          <div className="text top-row">
            <img src="/send_icon.png" alt="Image" className="image" />
            Post your own Projects
          </div>
          <a href="/src/html-pages/projectCreation.html" className="nav-link">Create Project</a>
          <div className="separator"></div>
          <div className="text bottom-row">
          <img src="/MatchMaker.png" alt="Image" className="image" />
          View Your Projects and Applications
          </div>
          <a href="/src/html-pages/industryProfile.html" className="nav-link">Here</a>
        </div>
      </div>
    </div>
  )
}

export default Industry;
