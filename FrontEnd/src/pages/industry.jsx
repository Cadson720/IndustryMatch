import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/industry.css";
import FeaturedIndustry from './featuredIndustry';
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';

const Industry = () => {
  const [isLoading, setIsLoading] = useState(true); // Loading state for the whole page
  const [isHeaderLoading, setIsHeaderLoading] = useState(true); // Loading state for the header
  const [isFeaturedLoaded, setIsFeaturedLoaded] = useState(false); // Loading state for FeaturedIndustry
  const navigate = useNavigate();

  // Simulate a loading effect for both content and header
  useEffect(() => {
    // Load FeaturedIndustry component data before stopping the loader
    const loadFeaturedIndustryData = async () => {
      // Simulate an API call or data fetch here for FeaturedIndustry
      // You can replace this with the actual data fetching logic
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulated delay
      setIsFeaturedLoaded(true); // Set to true once data is ready
    };

    loadFeaturedIndustryData().then(() => {
      // Once FeaturedIndustry is loaded, stop the loader
      setTimeout(() => {
        setIsLoading(false); // Set loading to false after the delay
        setIsHeaderLoading(false); // Set header loading to false after the delay
      }, 250);
    });
  }, []);

  const handleCreateProject = () => {
    navigate('/projectCreation');
  };

  const handleViewProjects = () => {
    navigate('/industryProfile');
  };

  // Show the loader while loading
  if (isLoading || !isFeaturedLoaded) {
    return <Loader />;
  }

  // Render the main content when not loading
  return (
    <div>
      <div className="header-container">
        {isHeaderLoading ? ( // Show the loader for the header
          <Loader />
        ) : (
          <Header /> // Render the Header component after loading
        )}
      </div>
      <div className="industry-container">
        <div className="left-column">
          <FeaturedIndustry /> {/* Render FeaturedIndustry once data is ready */}
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
    </div>
  );
}

export default Industry;
