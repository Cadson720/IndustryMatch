import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/projectDetail.css";

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [academic, setAcademic] = useState({
    academic_id: '', // Include academic_id in the initial state
    academic_email: '',
    role: '',
    school: '',
    phone: '',
  });
  const [proposalDescription, setProposalDescription] = useState(''); // For EOI proposal description
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get project ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/project/${projectId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch project data');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Fetch academic profile
  useEffect(() => {
    const fetchAcademicData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
          },
        });
        if (!response.ok) throw new Error('Failed to fetch academic data');
        const data = await response.json();
        setAcademic({
          academic_id: data.academic_id, // Ensure academic_id is set here
          academic_email: data.academic_email,
          role: data.role,
          school: data.school,
          phone: '',
        });
      } catch (error) {
        console.error('Error fetching academic profile:', error);
      }
    };

    fetchAcademicData();
  }, []);

  // Helper function to format description text
  const formatDetailedDescription = (description) => {
    return description
      .replace(/Project Objectives:/g, "Project Objectives:")
      .replace(/Technical Knowledge:/g, "Technical Knowledge:")
      .replace(/Student Year Recommendation:/g, "Student Year Recommendation");
  };

  // Helper function to add member details based on size
  const formatSize = (size) => {
    if (size === "Small") return `${size} (1 - 3 Members)`;
    if (size === "Medium") return `${size} (4 - 7 Members)`;
    if (size === "Large") return `${size} (8+ Members)`;
    return size;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const eoiData = {
      industry_id: project.industry_id,
      academic_id: academic.academic_id, // Use academic_id here
      project_id: projectId,
      eoi_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      proposal_description: proposalDescription,
      eoi_status: 'Pending',
    };

    try {
      const token = localStorage.getItem('jwtToken');
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/eoi`, eoiData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('EOI submitted successfully');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error submitting EOI:', error);
      alert('Failed to submit EOI');
    }
  };

  if (loading) return <p>Loading project details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="project-detail-page">
      <div className="project-columns">
        {/* Left Column: Project Details */}
        <div className="project-detail-column">
          {project ? (
            <div className="project-detail">
              <h2>{project.title}</h2>
              <div className="project-detail-columns">
                <div className="project-detail-left-column">
                  <p>
                    {project.industry} <strong>  -  </strong> {project.discipline}
                  </p>
                  <p>
                    <img src="/team.png" alt="team icon" className="team-icon" />
                    <strong> </strong> {formatSize(project.size)}
                  </p>
                  <p>
                    <img src="/clock.png" alt="duration icon" className="duration-icon" />
                    <strong> </strong> {project.duration}
                  </p>
                  <p>
                    <img src="/location.png" alt="location icon" className="location-icon" />
                    <strong> </strong> {project.location_type}
                    {(project.location_type === 'Flexible' || project.location_type === 'On-site') && project.address && (
                      <span> - {project.address}</span>
                    )}
                  </p>
                  <br />
                </div>
              </div>
              <p><strong>Description:</strong> {formatDetailedDescription(project.description)}</p>
              <div className="project-publish-info">
                <p><strong>Published:</strong> {project.publish_date}</p>
                <p><strong>Organisation:</strong> {project.Industry && project.Industry.organisation}</p>
              </div>
            </div>
          ) : (
            <p>No project found</p>
          )}
        </div>

        {/* Right Column: Application Form */}
        <div className="application-column">
          <h3>Your Details</h3>
          <form className="application-form" onSubmit={handleSubmit}>
            <label>Email:</label>
            <input type="email" name="email" value={academic.academic_email} readOnly />

            <label>School:</label>
            <input type="text" name="school" value={academic.school} readOnly />

            <label>Role:</label>
            <input type="text" name="role" value={academic.role} readOnly />

            <h3>Proposal</h3>

            <label>Description:</label>
            <textarea 
              name="proposal_description"
              value={proposalDescription}
              onChange={(e) => setProposalDescription(e.target.value)}
            />
            
            <button type="submit" className="apply-button">Submit Application</button>
            <button type="button" className="upload-button" onClick={() => alert("File upload is not functional")}>Upload File</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
