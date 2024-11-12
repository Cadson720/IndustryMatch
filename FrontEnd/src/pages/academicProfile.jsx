import React, { useState, useEffect } from 'react';
import "../styles/academicProfile.css";

const Academic_Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [userDetails, setUserDetails] = useState({
    email: '',
    role: '',
    school: ''
  });
  const [loading, setLoading] = useState(true); // Loading state
  const [editMode, setEditMode] = useState(false); // Edit mode state
  const [error, setError] = useState(null); // Error state

  const handleSignOut = () => {
    localStorage.removeItem('jwtToken'); // Remove the token from localStorage
    setUserType(null); // Clear the user type in state
    window.location.href = '/'; // Redirect to landing page
  };

  useEffect(() => {
    const fetchAcademicProfile = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/profile`, {
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
          email: data.academic_email,
          role: data.role,
          school: data.school,
        });
        setLoading(false); // Stop loading once data is fetched
      } catch (error) {
        console.error('Error fetching academic profile:', error);
        setError('Failed to load academic profile'); // Set the error state
        setLoading(false);
      }
    };

    fetchAcademicProfile();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/academic/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify(userDetails), // Send the updated details
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
                <label>University:</label>
                <input
                  type="text"
                  value={userDetails.school}
                  onChange={(e) => setUserDetails({ ...userDetails, school: e.target.value })}
                />
                <label>Role:</label>
                <input
                  type="text"
                  value={userDetails.role}
                  onChange={(e) => setUserDetails({ ...userDetails, role: e.target.value })}
                />
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
              </form>
            ) : (
              <>
                <p><strong>Email:</strong> {userDetails.email}</p>
                <p><strong>University:</strong> {userDetails.school}</p>
                <p><strong>Role:</strong> {userDetails.role}</p>
                <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Details</button>
              </>
            )}
          </div>
        );
      case 'projects':
        return (
          <div className="content-box">
            <h2>My Projects</h2>
            <div className="add-project-btn" onClick={() => (window.location.href = '/projectSearch')}>
              <i> + </i> Search for Projects...
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
          <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>Saved Projects</button>
          <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>My Applications</button>
          <button className="logout-btn" onClick={handleSignOut }>Log Out</button>
        </div>
        <div className="right-column">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Academic_Profile;
