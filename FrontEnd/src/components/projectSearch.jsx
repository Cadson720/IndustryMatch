import React, { useState, useEffect } from 'react';
import "../styles/projectSearch.css"; // Import the CSS for this component

const ProjectSearch = () => {
  // States for managing search inputs
  const [keywords, setKeywords] = useState('');
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [showExtended, setShowExtended] = useState(false); // Toggle for extended search criteria
  const [projects, setProjects] = useState([]); // State to hold all projects
  const [filteredProjects, setFilteredProjects] = useState([]); // State to hold the filtered projects
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch all projects from the backend when the component mounts
  useEffect(() => {
    fetch('http://localhost:3000/api/project')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        return response.json();
      })
      .then((data) => {
        setProjects(data); // Store the fetched project data
        setFilteredProjects(data); // Initially, all projects are displayed
        setLoading(false); // Set loading to false
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error); // Set error if fetching fails
        setLoading(false); // Set loading to false in case of error
      });
  }, []);

  // Function to toggle the extended search criteria
  const toggleExtendedCriteria = () => {
    setShowExtended(!showExtended);
  };

  // Function to handle search
  const handleSearch = () => {
    // Filter the projects based on the search criteria
    const filtered = projects.filter((project) => {
      const keywordMatch = project.industry.toLowerCase().includes(keywords.toLowerCase()) || project.industry.toLowerCase().includes(keywords.toLowerCase());
      const fieldMatch = field ? project.discipline === field : true;
      const durationMatch = duration ? project.duration === duration : true;
      const locationMatch = location ? project.location === location : true;
      const industryMatch = industry ? project.industry === industry : true;
      const sizeMatch = size ? project.size === size : true;

      // Return true if all conditions match
      return keywordMatch && fieldMatch && durationMatch && locationMatch && industryMatch && sizeMatch;
    });

    // Update the filtered projects
    setFilteredProjects(filtered);
  };

  // If still loading, show a loading message
  if (loading) return <p>Loading...</p>;

  // If there's an error, display it
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
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
            <option value="Software Engineering">Software Engineering</option>
            <option value="Environmental Studies">Environmental Studies</option>
            {/* Add more options as needed */}
          </select>

          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option value="">Any Length</option>
            <option value="four weeks">four weeks</option>
            <option value="six weeks">six weeks</option>
            <option value="twelve weeks">twelve weeks</option>
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Any Location</option>
            <option value="Online">Australia</option>
            <option value="Sydney">Sydney</option>
            <option value="Brisbane">Brisbane</option>
            <option value="Melbourne">Melbourne</option>
            {/* Add more options as needed */}
          </select>

          {/* Search Button */}
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

        {/* Extended Search Criteria (shown when hamburger is clicked) */}
        {showExtended && (
          <div className="extended-criteria">
            <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
              <option value="">Any Industry</option>
              <option value="Analytics and Data Science">Analytics and Data Science</option>
              <option value="Business">Business</option>
              <option value="Communication">Communication</option>
              <option value="Design, Architecture and Building">Design, Architecture and Building</option>
              <option value="Education">Education</option>
              <option value="Engineering">Engineering</option>
              <option value="Health">Health</option>
              <option value="Health (GEM)">Health (GEM)</option>
              <option value="Information Technology">Information Technology</option>
              <option value="International Studies and Social Sciences">International Studies and Social Sciences</option>
              <option value="Law">Law</option>
              <option value="Science and Mathematics">Science and Mathematics</option>
              <option value="Transdisciplinary Innovation">Transdisciplinary Innovation</option>
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

      {/* Render the filtered project list outside and below the search container */}
      <div className="project-list">
        {filteredProjects.length > 0 ? (
          <ul>
            {filteredProjects.map((project) => (
              <li key={project.ProjectID}>
                <p><strong>Project ID:</strong> {project.ProjectID}</p>
                <p><strong>Member ID:</strong> {project.MemberID}</p>
                <p><strong>Publish Date:</strong> {new Date(project.publishDate).toLocaleDateString()}</p>
                <p><strong>Discipline:</strong> {project.discipline}</p>
                <p><strong>Duration:</strong> {project.duration}</p>
                <p><strong>Size:</strong> {project.size}</p>
                <p><strong>Industry:</strong> {project.industry}</p>
                <p><strong>Location:</strong> {project.location}</p>
                <hr />
              </li>
            ))}
          </ul>
        ) : (
          <p>No matching projects found.</p>
        )}
      </div>
    </>
  );
};

export default ProjectSearch;
