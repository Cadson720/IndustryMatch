import React, { useState, useEffect } from 'react';
import "../styles/projectSearch.css"; // Import the CSS for this component
import "../styles/loader.css";
import Loader from '../pages/loader.jsx';
import Header from '../pages/header.jsx';

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

  const [academicId, setAcademicId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [savedProjectIds, setSavedProjectIds] = useState(new Set());


  
  const [modalError, setModalError] = useState('');

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
  
  

  // Fetch the academic profile to retrieve academic_id
  useEffect(() => {
    const fetchAcademicProfile = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/profile`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` },
          });
          if (!response.ok) throw new Error('Unable to fetch profile');
          const data = await response.json();
          setAcademicId(data.academic_id); // Assuming the profile response has academic_id
        } catch (error) {
          console.error('Failed to fetch academic profile:', error);
        }
      }
    };
    fetchAcademicProfile();
  }, []);

  // Fetch saved project IDs once academicId is available
  useEffect(() => {
    if (!academicId) return;
    
    const fetchSavedProjectIds = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/saved/${academicId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const savedIds = new Set(data.map((project) => project.Project.project_id));
          setSavedProjectIds(savedIds);
        } else {
          throw new Error('Failed to fetch saved projects');
        }
      } catch (error) {
        console.error('Error fetching saved projects:', error);
      }
    };
    fetchSavedProjectIds();
  }, [academicId]);



  // Fetch all projects from the backend when the component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        
        const data = await response.json();
        const validProjects = data.filter(isProjectValid);

        // Introduce a 1.5-second delay before updating the state
        setTimeout(() => {
          setProjects(validProjects);
          setFilteredProjects(validProjects);
          setLoading(false);

          // Set the first project as selected by default after fetch
          if (validProjects.length > 0) {
            setSelectedProject(validProjects[0]);
          }
        }, 250); // 0.25-second delay
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);
  // Function to toggle the extended search criteria
  const toggleExtendedCriteria = () => {
    setShowExtended(!showExtended);
  };

  // Function to handle search
  const handleSearch = () => {
    const filtered = projects.filter((project) => {
      // Search in title and description for the keyword
      const keywordMatch = project.title.toLowerCase().includes(keywords.toLowerCase()) ||
        project.description.toLowerCase().includes(keywords.toLowerCase());

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

  // Function to calculate project age in days
  const getProjectAgeInDays = (publishDate) => {
    const currentDate = new Date();
    const publishDateObj = new Date(publishDate);
    const timeDiff = Math.abs(currentDate - publishDateObj);
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  // Function to extract the suburb from the address
  const extractSuburb = (address) => {
    const parts = address.split(',');
    return parts.length > 1 ? parts[1].trim() : '';
  };

  // Function to limit preview description until "Project Objectives:"
  const getPreviewDescription = (description) => {
    const cutOffIndex = description.indexOf('Project Objectives:');
    return cutOffIndex > -1 ? description.substring(0, cutOffIndex) : description;
  };

  // Function to format detailed description with new lines at specific points
  const formatDetailedDescription = (description) => {
    return description
      .replace(/Project Objectives:/g, "Project Objectives:")
      .replace(/Technical Knowledge:/g, "Technical Knowledge:")
      .replace(/Student Year Recommendation:/g, "Student Year Recommendation")
      // .replace(/ - /g, "\n - ");
  };

  // Function to save a project for the current academic
const saveProject = async (projectID) => {
  try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
          throw new Error('No token found');
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/save`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ academic_id: academicId, project_id: projectID }),
      });

      if (response.ok) {
          setSavedProjectIds((prevSavedIds) => new Set(prevSavedIds).add(projectID));
          alert('Project saved successfully!');
      } else {
          throw new Error('Failed to save project');
      }
  } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project.');
  }
};

  // Unsave a project
  const unsaveProject = async (projectId) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/saved/${academicId}/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.ok) {
        const newSavedIds = new Set(savedProjectIds);
        newSavedIds.delete(projectId);
        setSavedProjectIds(newSavedIds);
        alert('Project unsaved successfully!');
      } else {
        throw new Error('Failed to unsave project');
      }
    } catch (error) {
      console.error('Error unsaving project:', error);
      alert('Failed to unsave project.');
    }
  };

  // JSX Button Logic based on saved status
  const renderSaveButton = (projectId) => {
    if (savedProjectIds.has(projectId)) {
      return (
        <button onClick={() => unsaveProject(projectId)} className="unsave-button">
          Unsave
        </button>
      );
    } else {
      return (
        <button onClick={() => saveProject(projectId)} className="save-button">
          Save
        </button>
      );
    }
  };

  // Handle project click to display detailed view
  const handleProjectClick = (project) => {
    setSelectedProject(project);
  };

  if (loading) return <Loader />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="project-search-page">
      {!loading && <Header />}
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
          <option value="Remote (online)">Remote (online)</option>
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
                <p1>{project.industry} - {project.discipline}</p1>
                <p>
                  <img src="/clock.png" alt="duration icon" className="duration-icon" />
                  {project.duration}
                </p>
                <p1>
                  <img src="/location.png" alt="location icon" className="location-icon" />
                  <strong>  </strong>{project.location_type}
                </p1>
                <p>{getPreviewDescription(project.description).slice(0, -2)}..</p> {/* Remove last character and add ".." */}
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
              <div className="project-detail-columns">

                {/* Left Column: Industry, Discipline, Size */}
                <div className="project-detail-left-column">
                  <p>{selectedProject.industry}<strong>  -  </strong>{selectedProject.discipline}</p>
                  <p>
                    <img src="/team.png" alt="team icon" className="team-icon" />
                     {selectedProject.size} 
                    {selectedProject.size === 'Small' ? ' (1 - 3 Members)' : selectedProject.size === 'Medium' ? ' (4 - 6 Members)' : selectedProject.size === 'Large' ? ' (7+ Members)' : ''}
                  </p>
                  <p>
                    <img src="/clock.png" alt="duration icon" className="duration-icon" />
                    <strong> </strong> {selectedProject.duration}
                  </p>
                  <p>
                    <img src="/location.png" alt="location icon" className="location-icon" />
                    <strong>  </strong> {selectedProject.location_type}
                    {(selectedProject.location_type === 'Flexible' || selectedProject.location_type === 'On-site') && selectedProject.address && (
                      <> - {extractSuburb(selectedProject.address)}</>
                    )}
                  </p>
                  <div className="actions">
                    {academicId && ( // Only show buttons if an academic user is logged in
                      <>
                        <a href={`/projectDetail?projectId=${selectedProject.project_id}`}>
                          <button className="apply-button">Apply</button>
                        </a>
                        <div className="actions">
                          {academicId && renderSaveButton(selectedProject.project_id)}
                        </div>

                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description with formatted new lines */}
              <p><strong></strong>{formatDetailedDescription(selectedProject.description)}</p>

              <div className="project-publish-info">
                <br />
                <p><strong>Published:</strong> {getProjectAgeInDays(selectedProject.publish_date)} days ago</p>
                <p><strong>Organisation:</strong> {selectedProject.Industry.organisation}</p>
              </div>
            </div>
          ) : (
            <p>Please select a project to see details.</p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProjectSearch;
