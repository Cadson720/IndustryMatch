import React, { useState, useEffect } from 'react';
import "../styles/projectSearch.css"; // Import the CSS for this component

const disciplinesByIndustry = {
  'Business & Management': ['Finance', 'Marketing'],
  'Creative Arts': ['Graphic Design', 'Music'],
  'Engineering and Mathematics': ['Civil Engineering', 'Mechanical Engineering'],
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
  const [showExtended, setShowExtended] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    const filtered = projects.filter((project) => {
      const keywordMatch = project.industry.toLowerCase().includes(keywords.toLowerCase()) || project.industry.toLowerCase().includes(keywords.toLowerCase());
      const fieldMatch = field ? project.discipline === field : true;
      const durationMatch = duration ? project.duration === duration : true;
      const locationMatch = location ? project.location === location : true;
      const industryMatch = industry ? project.industry === industry : true;
      const sizeMatch = size ? project.size === size : true;

      return keywordMatch && fieldMatch && durationMatch && locationMatch && industryMatch && sizeMatch;
    });

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

          <select value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="">Any Industry</option>
            <option value="Business & Management">Business & Management</option>
            <option value="Creative Arts">Creative Arts</option>
            <option value="Engineering and mathematics">Engineering and Mathematics</option>
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
            <option value="24 Weeks">24 Weeks</option>
          </select>

          <select value={location} onChange={(e) => setLocation(e.target.value)}>
            <option value="">Any Location</option>
            <option value="Online">Australia</option>
            <option value="Sydney">Sydney</option>
            <option value="Brisbane">Brisbane</option>
            <option value="Melbourne">Melbourne</option>
          </select>

          {/* Search Button */}
          <button className="search-button" onClick={handleSearch}>Search</button>
        </div>

        {/* Extended Search Criteria (shown when hamburger is clicked) */}
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
