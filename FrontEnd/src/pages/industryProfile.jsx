import React, { useState, useEffect } from 'react';
import "../styles/industryProfile.css";

const Industry_Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [userDetails, setUserDetails] = useState({
    email: '',
    industry: '',
    organisation: ''  // Change department to organisation
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchIndustryProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('http://localhost:3000/api/industry/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
          },
        });

        if (!response.ok) {
          const errorMessage = `Error: ${response.status} ${response.statusText}`;
          throw new Error(errorMessage);
        }

        const data = await response.json();
        setUserDetails({
          email: data.industry_email,
          industry: data.industry_discipline,  // Ensure you get the correct field
          organisation: data.organisation,  // Fetch organisation instead of department
        });
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching industry profile:', error);
        setError('Failed to load industry profile'); // Set the error state
        setLoading(false);
      }
    };

    fetchIndustryProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch('http://localhost:3000/api/industry/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify({
          email: userDetails.email,
          industry_discipline: userDetails.industry,  // Send industry_discipline instead of industry
          organisation: userDetails.organisation  // Send organisation instead of department
        }), // Send the updated details
      });

      if (!response.ok) {
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      setEditMode(false);
      setError(null); // Clear any errors
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p>Loading profile...</p>;
    }

    if (error) {
      return <p>{error}</p>; // Display the error if one occurred
    }

    switch (activeTab) {
      case 'details':
        return (
          <div className="content-box">
            <h2>My Details</h2>
            {editMode ? (
              <form onSubmit={handleProfileUpdate}>
                <label>Email:</label>
                <input
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                />
                <label>Industry:</label>
                <input
                  type="text"
                  value={userDetails.industry}
                  onChange={(e) => setUserDetails({ ...userDetails, industry: e.target.value })}
                />
                <label>Organisation:</label> {/* Change from Department to Organisation */}
                <input
                  type="text"
                  value={userDetails.organisation}  // Change from department to organisation
                  onChange={(e) => setUserDetails({ ...userDetails, organisation: e.target.value })}  // Handle change accordingly
                />
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </form>
            ) : (
              <>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>Industry:</strong> {userDetails.industry}</p>
                <p><strong>Organisation:</strong> {userDetails.organisation}</p> {/* Adjusted */}
                <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Details</button>
              </>
            )}
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
          </div>
        );
      case 'drafts':
        return (
          <div className="content-box">
            <h2>Saved Drafts</h2>
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
