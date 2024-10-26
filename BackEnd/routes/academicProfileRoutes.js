import React, { useState, useEffect } from 'react';
import "../styles/projectDetail.css"; // Separate CSS file for project details page

const ProjectDetail = () => {
  const [project, setProject] = useState(null);
  const [academic, setAcademic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get project ID from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('projectId');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project/${projectId}`);
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

  useEffect(() => {
    const fetchAcademicData = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) return;

      try {
        const response = await fetch('http://localhost:3000/api/academic/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error('Failed to fetch academic data');
        const data = await response.json();
        setAcademic(data); // assuming full academic data is returned
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
                        {project.industry}<strong>  -  </strong> {project.discipline}
                    </p>
                  <p>
                    <img src="/team.png" alt="team icon" className="team-icon" />
                    <strong>Size: </strong> {formatSize(project.size)}
                  </p>
                  <p>
                    <img src="/clock.png" alt="duration icon" className="duration-icon" />
                    <strong>Duration: </strong> {project.duration}
                  </p>
                  <p>
                    <img src="/location.png" alt="location icon" className="location-icon" />
                    <strong>Location: </strong> {project.location_type}
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
          <h3>Apply for Project</h3>
          <form className="application-form">
            <label>Email:</label>
            <input type="email" name="email" value={academic?.academic_email || ''} required readOnly />
            <label>Phone Number:</label>
            <input type="tel" name="phone" defaultValue={academic?.phone || ''} required />
            <label>School:</label>
            <input type="text" name="school" value={academic?.school || ''} required readOnly />
            <label>Additional Information:</label>
            <textarea name="additionalInfo"></textarea>
            <button type="submit" className="apply-button">Submit Application</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
