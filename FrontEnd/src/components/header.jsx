import React, { useState, useEffect, useRef } from 'react';
import "../styles/header.css";

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState(0); // To store menu position
  const academicNameRef = useRef(null); // Reference to the academic-name
  const [isLandingPage, setIsLandingPage] = useState(false); // To check if it's landing.html

  useEffect(() => {
    // Check if the current page is landing.html
    const currentPath = window.location.pathname;
    if (currentPath.includes('landing.html')) {
      setIsLandingPage(true); // Set the state to hide dropdown
    } else {
      setIsLandingPage(false); // Allow dropdown on other pages
    }
  }, []);

  // Toggle dropdown visibility and update the menu position
  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    if (academicNameRef.current) {
      const nameWidth = academicNameRef.current.offsetWidth;
      setMenuPosition((nameWidth / 2) + 5); // Center the menu with 5px offset to the right
    }
  };

  return (
    <header className="header">
      <div className="inner_header">
        <img src="/efi_logo_simple.png" href="main.jsx" alt="Logo" className="logo" />
        <nav className="nav">
          <a href="/src/html-pages/landing.html" className="nav-link">Home</a>
          <a href="/src/html-pages/projectSearch.html" className="nav-link">Project Search</a>
          <a href="/src/html-pages/savedProject.html" className="nav-link">Saved Projects</a>
          <a href="/src/html-pages/projectCreation.html" className="nav-link">Create Project</a>

          {/* Conditionally render dropdown */}
          {!isLandingPage && (
            <div className="dropdown" onClick={toggleDropdown}>
              <span className="academic-name" ref={academicNameRef}>
                Ethan <span className="arrow-down">▼</span>
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu" style={{ left: `calc(50% - ${menuPosition}px)` }}>
                  <a href="/src/html-pages/academicProfile.html" className="dropdown-item">Profile</a>
                  <a href="/saved-projects" className="dropdown-item">Saved Projects</a>
                  <a href="/saved-searches" className="dropdown-item">Saved Searches</a>
                  <a href="/applications" className="dropdown-item">Applications</a>
                  <a href="/recommended-projects" className="dropdown-item">Recommended Projects</a>
                  <a href="/settings" className="dropdown-item">Settings</a>
                  <a href="/src/html-pages/landing.html" className="dropdown-item signout">Sign Out</a>
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
