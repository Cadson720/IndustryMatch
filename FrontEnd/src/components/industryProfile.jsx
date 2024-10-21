import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/industryProfile.css";

const Industry_Profile = () => {
  const [activeTab, setActiveTab] = useState('details');
//   const navigate = useNavigate(); 

  const renderContent = () => {
    switch (activeTab) {
      case 'details':
        return (
          <div className="content-box">
            <h2>My Details</h2>
            <p><strong>Email:</strong> example.email@gmail.com</p>
            <p><strong>Industry:</strong> Example Industry</p>
            <p><strong>Department:</strong> Example Department</p>
            <p><strong>Password:</strong> *******</p>
            <button className="edit-btn">Edit Details</button>
          </div>
        );
      case 'projects':
        return (
            <div className="content-box">
              <h2>My Projects</h2>
              <div className="add-project-btn" onClick={() => navigate('/projectCreation')}>
                <i> + </i> Add A Project...
              </div>
            </div>
          );
      case 'applications':
        return <div className="content-box"><h2>Applications</h2></div>;
      case 'drafts':
        return <div className="content-box"><h2>Saved Drafts</h2></div>;
      default:
        return null;
    }
  };

//   const renderContent = () => {
//     return (
//       <div className="content-box">
//         <h2>My Details</h2>
//         {editMode ? (
//           <>
//             <label>Email: </label>
//             <input
//               type="email"
//               value={userDetails.email}
//               onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
//             />
//             <label>Industry: </label>
//             <input
//               type="text"
//               value={userDetails.industry}
//               onChange={(e) => setUserDetails({ ...userDetails, industry: e.target.value })}
//             />
//             <label>Department: </label>
//             <input
//               type="text"
//               value={userDetails.department}
//               onChange={(e) => setUserDetails({ ...userDetails, department: e.target.value })}
//             />
//             <button className="save-btn" onClick={handleEdit}>Save</button>
//             <button className="cancel-btn" onClick={() => setEditMode(false)}>Cancel</button>
//           </>
//         ) : (
//           <>
//             <p><strong>Email:</strong> {userDetails.email}</p>
//             <p><strong>Industry:</strong> {userDetails.industry}</p>
//             <p><strong>Department:</strong> {userDetails.department}</p>
//             <p><strong>Password:</strong> {userDetails.password}</p>
//             <button className="edit-btn" onClick={() => setEditMode(true)}>Edit Details</button>
//           </>
//         )}
//       </div>
//     );
//   };


  const handleEdit = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
      });

      if (response.ok) {
        setEditMode(false);
        // Optionally fetch updated user details again
        fetchUserProfile();
      } else {
        console.error('Error updating user details');
      }
    } catch (error) {
      console.error('Error editing user details:', error);
    }
  };

  const handleLogout = () => {
    // localStorage.removeItem('token'); 
    navigate('/'); 
  };

  return (
    <div className="ip-container">
        <div className="heading">My Profile</div>
        <div className="column-container">
            <div className="left-column">
                <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>My Details</button>
                <button className={`tab-btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>My Projects</button>
                <button className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`} onClick={() => setActiveTab('applications')}>Applications</button>
                <button className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`} onClick={() => setActiveTab('drafts')}>Saved Drafts</button>
                <button className="logout-btn" onClick={handleLogout}>Log Out</button>
            </div>
            <div className="right-column">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default Industry_Profile;
