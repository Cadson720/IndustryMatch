import React, { useState, useEffect, useRef } from 'react';
import { useJwt } from "react-jwt"; // Import the useJwt hook from react-jwt
import "../styles/header.css";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState(0); // To store menu position
  const academicNameRef = useRef(null); // Reference to the academic-name
  const [userType, setUserType] = useState(null); // Store user type from JWT
  const [userEmail, setUserEmail] = useState("User"); // Store the user email from the token

  // Use the useJwt hook from react-jwt to decode the JWT from localStorage
  const { decodedToken, isExpired } = useJwt(localStorage.getItem('jwtToken'));

  useEffect(() => {
    // Check if the JWT token is valid and not expired
    if (decodedToken && !isExpired) {
      setUserType(decodedToken.type); // Set user type from decoded token

      // Extract email based on user type (Academic or Industry)
      if (decodedToken.type === 'Academic') {
        setUserEmail(decodedToken.profile.academic_email);
      } else if (decodedToken.type === 'Industry') {
        setUserEmail(decodedToken.profile.industry_email);
      }
    }
  }, [decodedToken, isExpired]);

  // Toggle dropdown visibility and update the menu position
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    if (academicNameRef.current) {
      const nameWidth = academicNameRef.current.offsetWidth;
      setMenuPosition((nameWidth / 2) + 5); // Center the menu with 5px offset to the right
    }
  };

  // Sign out function: clear JWT token and reload the page
  const handleSignOut = () => {
    localStorage.removeItem('jwtToken'); // Remove the token from localStorage
    setUserType(null); // Clear the user type in state
    window.location.href = '/src/html-pages/landing.html'; // Redirect to landing page
  };

  return (
    <header className="header">
      <div className="inner_header">
        <img src="/efi_logo_simple.png" href="main.jsx" alt="Logo" className="logo" />
        <nav className="nav">
          

        {userType === null && (
            <>
              <a href="/src/html-pages/landing.html" className="nav-link">Home</a>
              <a href="/src/html-pages/about.html" className="nav-link">About</a>
            </>
          )}
          
          {/* Shared Links */}

          {/* Conditionally render links based on user type */}
          {userType === 'Academic' && (
            <>
              <a href="/src/html-pages/landing.html" className="nav-link">Home</a>
              <a href="/src/html-pages/projectSearch.html" className="nav-link">Project Search</a>
              <a href="/src/html-pages/savedProject.html" className="nav-link">Saved Projects</a>
              <a href="/src/html-pages/projectCreation.html" className="nav-link">Create Project</a>
            </>
          )}
          
          {userType === 'Industry' && (
            <>
              <a href="/src/html-pages/landing.html" className="nav-link">Home</a>
              <a href="/src/html-pages/about.html" className="nav-link">About</a>
              <a href="/src/html-pages/projectSearch.html" className="nav-link">Project Search</a>
              <a href="/src/html-pages/projectCreation.html" className="nav-link">Create Projects</a>
            </>
          )}

          {/* Always render the dropdown if the user is logged in */}
          {userType && (
            <div className="dropdown" onClick={toggleDropdown}>
              <span className="academic-name" ref={academicNameRef}>
                {userEmail} <span className="arrow-down">▼</span>
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu" style={{ left: `calc(50% - ${menuPosition}px)` }}>
                  
                  {/* Additional options based on user type */}
                  {userType === 'Academic' && (
                    <>
                      <a href="/src/html-pages/academicProfile.html" className="dropdown-item">Profile</a>
                      <a href="/src/html-pages/savedProject.html" className="dropdown-item">Saved Projects</a>
                      <a href="/src/html-pages/applicationsAcademic.html" className="dropdown-item">Applications</a>
                      <a href="/src/html-pages/recommendedProjects.html" className="dropdown-item">Recommended Projects</a>
                    </>
                  )}

                  {userType === 'Industry' && (
                    <>
                      <a href="/src/html-pages/industryProfile.html" className="dropdown-item">Profile</a>
                      <a href="/src/html-pages/industryProfile.html" className="dropdown-item">View Applications</a>
                      <a href="/src/html-pages/industryProfile.html" className="dropdown-item">Manage Projects</a>
                      <a href="/src/html-pages/industryProfile.html" className="dropdown-item">Create Projects</a>
                    </>
                  )}

                  <span className="dropdown-item signout" onClick={handleSignOut}>Sign Out</span> {/* Call handleSignOut on click */}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
