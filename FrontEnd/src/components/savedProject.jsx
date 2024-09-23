import React, { useState } from 'react';
import "../styles/savedProject.css"; // Import the CSS for this component

const ProjectSearch = () => {
  // States for managing search inputs
  const [keywords, setKeywords] = useState('');
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [showExtended, setShowExtended] = useState(false); // Toggle for extended search criteria

  const toggleExtendedCriteria = () => {
    setShowExtended(!showExtended);
  };

  return (
    <div className="project-search-container">
      <div className="search-bar">
        {/* Hamburger Menu Icon */}
        <div className="hamburger-menu" onClick={toggleExtendedCriteria}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Input Fields */}
        <input
          type="text"
          placeholder="Keywords"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
        />

        <select value={field} onChange={(e) => setField(e.target.value)}>
          <option value="">Any Discipline</option>
          <option value="Engineering">Engineering</option>
          <option value="Science">Science</option>
          {/* Add more options as needed */}
        </select>

        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Any Length</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Any Location</option>
          <option value="Australia">Australia</option>
          <option value="USA">USA</option>
          {/* Add more options as needed */}
        </select>

        {/* Search Button */}
        <button className="search-button">Search</button>
      </div>

      {/* Extended Search Criteria (shown when hamburger is clicked) */}
      {showExtended && (
        <div className="extended-criteria">
          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">Any Industry</option>
            <option value="Tech">Tech</option>
            <option value="Finance">Finance</option>
            {/* Add more options as needed */}
          </select>

          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Any Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default ProjectSearch;
