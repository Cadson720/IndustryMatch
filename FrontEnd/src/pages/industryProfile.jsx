import React, { useState, useEffect } from 'react';
import "../styles/industryProfile.css";

const Industry_Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [userDetails, setUserDetails] = useState({
    email: '',
    industry: '',
    organisation: '',
    industry_id: '' // Store industry_id for fetching applications
  });
  const [applications, setApplications] = useState([]); // State to store applications
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIndustryProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }
  
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/industry/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }
  
        const data = await response.json();
        //console.log("Fetched profile data:", data); // Debugging to confirm industry_id is present
  
        setUserDetails({
          email: data.industry_email,
          industry: data.industry_discipline,
          organisation: data.organisation,
          industry_id: data.industry_id, // Ensure industry_id is set here
        });
  
        setLoading(false);
      } catch (error) {
        console.error('Error fetching industry profile:', error);
        setError('Failed to load industry profile');
        setLoading(false);
      }
    };
  
    fetchIndustryProfile();
  }, []);
  

  // Fetch applications (EOIs) for the industry
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        if (!userDetails.industry_id) {
          console.log("industry_id is not available yet"); // Debugging
          return;
        }

        const token = localStorage.getItem('jwtToken');
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/eoi/industry/${userDetails.industry_id}`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to load applications');

        const data = await response.json();
        //console.log('Fetched Applications:', data); // Log fetched applications
        setApplications(data); // Set the applications state with the data
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications');
      }
    };

    if (activeTab === 'applications') {
      fetchApplications();
    }
  }, [activeTab, userDetails.industry_id]);

  const renderApplications = () => {
    if (applications.length === 0) {
      return <p>No applications found.</p>;
    }
  
    return (
      <ul>
        {applications.map((app) => (
          <li key={app.eoi_id} style={{ color: '#000', padding: '1rem', backgroundColor: '#fff', borderRadius: '8px' }}>
            <strong>Project ID:</strong> {app.project_id} <br />
            <strong>Application Date:</strong> {app.eoi_date} <br />
            <strong>Status:</strong> {app.eoi_status} <br />
            <strong>Description:</strong> {app.proposal_description}
          </li>
        ))}
      </ul>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    if (error) {
      return <p>{error}</p>;
    }

    switch (activeTab) {
      case 'details':
        return (
          <div className="content-box">
            <h2>My Details</h2>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Industry:</strong> {userDetails.industry}</p>
            <p><strong>Organisation:</strong> {userDetails.organisation}</p>
          </div>
        );
      case 'projects':
        return (
          <div className="content-box">
            <h2>My Projects</h2>
            <div className="add-project-btn" onClick={() => (window.location.href = '/projectCreation')}>
              <i> + </i> Add A Project...
            </div>
          </div>
        );
      case 'applications':
        return (
          <div className="content-box">
            <h2>Applications</h2>
            {renderApplications()}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="ip-container">
      <div className="heading">My Profile</div>
      <div className="column-container">
        <div className="left-column">
          <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>My Details</button>
          <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>My Projects</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Applications</button>
          <button className="logout-btn" onClick={() => localStorage.removeItem('jwtToken')}>Log Out</button>
        </div>
        <div className="right-column">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Industry_Profile;
