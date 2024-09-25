import React, { useState, useEffect } from 'react';
import "../styles/projectSearch.css"; // Import the CSS for this component

const disciplinesByIndustry = {
  'Business & Management': ['Finance', 'Marketing'],
  'Creative Arts': ['Graphic Design', 'Music'],
  'Engineering & Mathematics': ['Civil Engineering', 'Mechanical Engineering'],
  'Food, Hospitality & Personal Services': ['Culinary Arts', 'Hotel Management'],
  'Humanities, Arts, & Social Sciences': ['Philosophy', 'Sociology'],
  'IT & Computer Science': ['Software Engineering', 'Cybersecurity'],
  'Law, Legal Studies & Justice': ['Corporate Law', 'Criminal Justice'],
  'Medical & Health Studies': ['Nursing', 'Pharmacy'],
  'Property & Built Environment': ['Architecture', 'Urban Planning'],
  'Sciences': ['Biology', 'Chemistry'],
  'Teaching & Education': ['Primary Education', 'Secondary Education'],
  'Trades & Services': ['Carpentry', 'Electrician'],
};

const ProjectSearch = () => {
  const [keywords, setKeywords] = useState('');
  const [field, setField] = useState('');
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState('');
  const [size, setSize] = useState('');
  const [showExtended, setShowExtended] = useState(false); // Toggle for extended search criteria
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

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
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);

        // Set the first project as selected by default after fetch
        if (data.length > 0) {
          setSelectedProject(data[0]);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  // Function to toggle the extended search criteria
  const toggleExtendedCriteria = () => {
    setShowExtended(!showExtended);
  };

  // Function to handle search
  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      const keywordMatch =
        project.industry.toLowerCase().includes(keywords.toLowerCase()) ||
        project.discipline.toLowerCase().includes(keywords.toLowerCase()) ||
        project.title.toLowerCase().includes(keywords.toLowerCase());

      const fieldMatch = field ? project.discipline === field : true;
      const durationMatch = duration ? project.duration === duration : true;
      const locationMatch = location ? project.location === location : true;
      const industryMatch = industry ? project.industry === industry : true;
      const sizeMatch = size ? project.size === size : true;

      return keywordMatch && fieldMatch && durationMatch && locationMatch && industryMatch && sizeMatch;
    });

    setFilteredProjects(filtered);

    // Automatically set the first filtered project as the selected project
    if (filtered.length > 0) {
      setSelectedProject(filtered[0]);
    } else {
      setSelectedProject(null); // Clear if no projects match the search
    }
  };

  // Handle project click to display detailed view
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

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

        <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
          <option value="">Any Industry</option>
          <option value="Business & Management">Business & Management</option>
          <option value="Creative Arts">Creative Arts</option>
          <option value="Engineering & Mathematics">Engineering & Mathematics</option>
          <option value="Food, Hospitality & Personal Services">Food, Hospitality & Personal Services</option>
          <option value="Humanities, Arts, & Social Sciences">Humanities, Arts, & Social Sciences</option>
          <option value="IT & Computer Science">IT & Computer Science</option>
          <option value="Law, Legal Studies & Justice">Law, Legal Studies & Justice</option>
          <option value="Medical & Health Studies">Medical & Health Studies</option>
          <option value="Property & Built Environment">Property & Built Environment</option>
          <option value="Sciences">Sciences</option>
          <option value="Teaching & Education">Teaching & Education</option>
          <option value="Trades & Services">Trades & Services</option>
        </select>

        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Any Length</option>
          <option value="4 weeks">4 Weeks</option>
          <option value="6 weeks">6 Weeks</option>
          <option value="8 weeks">8 Weeks</option>
          <option value="12 weeks">12 Weeks</option>
          <option value="24 weeks">24 Weeks</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Any Location</option>
          <option value="Online">Online</option>
          <option value="Sydney">Sydney</option>
          <option value="Brisbane">Brisbane</option>
          <option value="Melbourne">Melbourne</option>
        </select>

        {/* Search Button */}
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {/* Extended Search Criteria */}
      {showExtended && (
        <div className="extended-criteria">
          <select
            value={field}
            onChange={(e) => setField(e.target.value)}
            disabled={!industry} // Disable until industry is selected
          >
            <option value="">Any Discipline</option>
            {industry && disciplinesByIndustry[industry]?.map((discipline) => (
              <option key={discipline} value={discipline}>
                {discipline}
              </option>
            ))}
          </select>

          <select value={size} onChange={(e) => setSize(e.target.value)}>
            <option value="">Any Size</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
      )}

      <div className="project-columns">
        {/* Left Side: Project Previews */}
        <div className="project-preview-column">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.ProjectID}
                className={`project-preview ${selectedProject && selectedProject.ProjectID === project.ProjectID ? 'active' : ''}`}
                onClick={() => handleProjectClick(project)}
              >
                <p><strong>{project.title}</strong></p>
                <p>{project.industry}</p>
                <p>{project.duration}</p>
                <p>{project.location}</p>
                <p><em>Short description coming soon...</em></p>
              </div>
            ))
          ) : (
            <p>No matching projects found.</p>
          )}
        </div>

        {/* Right Side: Detailed View */}
        <div className="project-detail-column">
          {selectedProject ? (
            <div className="project-detail">
              <h2>{selectedProject.title}</h2>
              <p><strong>Industry:</strong> {selectedProject.industry}</p>
              <p><strong>Duration:</strong> {selectedProject.duration}</p>
              <p><strong>Location:</strong> {selectedProject.location}</p>
              <p><strong>Discipline:</strong> {selectedProject.discipline}</p>
              <p><strong>Size:</strong> {selectedProject.size}</p>
              <p><strong>Publish Date:</strong> {new Date(selectedProject.publishDate).toLocaleDateString()}</p>
              
              {/* Display Member Info from Industry */}
              {selectedProject.Industry && (
                <div>
                  <p><strong>Member ID:</strong> {selectedProject.Industry.MemberID}</p>
                  <p><strong>Email:</strong> {selectedProject.Industry.email}</p>
                  <p><strong>Organisation:</strong> {selectedProject.Industry.organisation}</p>
                </div>
              )}
            </div>
          ) : (
            <p>Please select a project to see details.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectSearch;
