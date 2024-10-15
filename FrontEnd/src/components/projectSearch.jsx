import React, { useState, useEffect } from 'react';
import "../styles/projectSearch.css"; // Import the CSS for this component

const disciplinesByIndustry = {
  'Business': [
    'Economics', 
    'Human Resources', 
    'Management', 
    'Accounting, Commerce & Finance', 
    'Hospitality, Tourism & Retail', 
    'Marketing, Advertising & Public Relations'
  ],
  'Design & Arts': [
    'Animation, Visual Effects & Post Production', 
    'Creative Arts', 
    'Media Studies', 
    'Fashion Design', 
    'Film & TV', 
    'Graphic Design & Visual Arts', 
    'Journalism & Writing', 
    'Music & Performing Arts'
  ],
  'Engineering': [
    'Aerospace Engineering', 
    'Software Engineering', 
    'Automotive & Transport Engineering', 
    'Biomedical Engineering', 
    'Civil Engineering & Construction', 
    'Mechanical Engineering', 
    'Mechatronic Engineering', 
    'Electrical Engineering', 
    'Chemical Engineering', 
    'Industrial Engineering', 
    'Robotics Engineering', 
    'Environmental Engineering', 
    'Marine Engineering', 
    'Manufacturing Engineering', 
    'Mining Engineering'
  ],
  'IT & Computer Science': [
    'Artificial Intelligence', 
    'Computer Graphics & Animations', 
    'Computer Systems & Networks', 
    'Cyber Security', 
    'Data Science', 
    'Design & User Experience', 
    'Video Game Development'
  ],
  'Law, Legal Studies & Justice': [
    'Criminal Justice', 
    'Corporate Law', 
    'Law Enforcement'
  ],
  'Health': [
    'Nursing', 
    'Pharmacist', 
    'Dentistry & Orthopediatrics', 
    'Exercise & Sports Science', 
    'Midwifery', 
    'Occupational', 
    'Paramedics', 
    'Physiotherapy', 
    'Psychology'
  ],
  'Education': [
    'Primary Teaching', 
    'Secondary Teaching', 
    'Special Education', 
    'Tertiary Education'
  ],
  'Science': [
    'Astronomy', 
    'Biochemistry', 
    'Biology', 
    'Chemistry', 
    'Geology', 
    'Genetics', 
    'Food Science', 
    'Forensic Science', 
    'Environmental Science', 
    'Physics', 
    'Marine Science', 
    'Veterinary Science'
  ],
  'Social Sciences & Communication': [
    'Criminology', 
    'International Studies', 
    'Languages & Linguistics', 
    'Literature', 
    'Philosophy', 
    'Social Work', 
    'Politics'
  ],
  'Food & Hospitality': [
    'Culinary Arts', 
    'Hotel Management', 
    'Carers'
  ],
  'Trades & Services': [
    'Carpentry', 
    'Electrician', 
    'Plumping', 
    'Flooring, Plastering & Tiling', 
    'Heating, Ventilation & Cooling', 
    'Bricklaying & Stonemasonry', 
    'Surveying'
  ]
};

const ProjectSearch = () => {
  const [keywords, setKeywords] = useState('');
  const [field, setField] = useState(''); // Discipline
  const [duration, setDuration] = useState('');
  const [location, setLocation] = useState('');
  const [industry, setIndustry] = useState(''); // Industry
  const [size, setSize] = useState('');
  const [showExtended, setShowExtended] = useState(false); // Toggle for extended search criteria
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  // Function to check if all required fields are present
  const isProjectValid = (project) => {
    return (
      project.title &&
      project.industry &&
      project.duration &&
      project.location_type &&
      project.discipline &&
      project.size &&
      project.publish_date &&
      project.description &&
      project.Industry && project.Industry.organisation
    );
  };

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
        const validProjects = data.filter(isProjectValid);
        setProjects(validProjects);
        setFilteredProjects(validProjects);
        setLoading(false);

        // Set the first project as selected by default after fetch
        if (validProjects.length > 0) {
          setSelectedProject(validProjects[0]);
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

  // Function to handle industry change
  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    setIndustry(selectedIndustry);

    // Reset the discipline when the industry changes
    setField('');
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
      const locationMatch = location ? project.location_type === location : true;
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

  // Function to extract the suburb from the address
  const extractSuburb = (address) => {
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
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

        <select value={industry} onChange={handleIndustryChange}>
          <option value="">Any Industry</option>
          {Object.keys(disciplinesByIndustry).map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>

        <select value={duration} onChange={(e) => setDuration(e.target.value)}>
          <option value="">Any Length</option>
          <option value="4 Weeks">4 Weeks</option>
          <option value="6 Weeks">6 Weeks</option>
          <option value="8 Weeks">8 Weeks</option>
          <option value="12 Weeks">12 Weeks</option>
          <option value="24 Weeks">24 Weeks</option>
        </select>

        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Any Location</option>
          <option value="Online (Remote)">Online (Remote)</option>
          <option value="On-site">On-site</option>
          <option value="Flexible">Flexible</option>
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
            <option value="Small">Small (1-3 Team Size)</option>
            <option value="Medium">Medium (4-6 Team Size)</option>
            <option value="Large">Large (7+ Team Size)</option>
          </select>
        </div>
      )}

      <div className="project-columns">
        {/* Left Side: Project Previews */}
        <div className="project-preview-column">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div
                key={project.project_id}
                className={`project-preview ${selectedProject && selectedProject.project_id === project.project_id ? 'active' : ''}`}
                onClick={() => handleProjectClick(project)}
              >
                <h3><strong>{project.title}</strong></h3>
                <p>{project.industry}</p>
                <p>{project.duration}</p>
                <p>{project.location_type}</p>
                <p><em>{project.description}</em></p>
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
              <p><strong>Location:</strong> {selectedProject.location_type}</p>
              
              {/* If location type is 'Flexible' or 'On-site', display suburb */}
              {(selectedProject.location_type === 'Flexible' || selectedProject.location_type === 'On-site') && selectedProject.address && (
                <p><strong>Suburb:</strong> {extractSuburb(selectedProject.address)}</p>
              )}

              <p><strong>Discipline:</strong> {selectedProject.discipline}</p>
              <p><strong>Size:</strong> {selectedProject.size}</p>
              <p><strong>Publish Date:</strong> {new Date(selectedProject.publish_date).toLocaleDateString()}</p>
              <p><strong>Description:</strong> {selectedProject.description}</p>

              {/* Display Industry Information */}
              {selectedProject.Industry && (
                <div>
                  <p><strong>Organisation:</strong> {selectedProject.Industry.organisation}</p>
                  <p><strong>Email:</strong> {selectedProject.Industry.email}</p>
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
