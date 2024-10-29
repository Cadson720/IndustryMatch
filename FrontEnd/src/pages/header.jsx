import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useJwt } from 'react-jwt';
import '../styles/header.css';

const Header = () => {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState(0);
  const academicNameRef = useRef(null);
  const [userType, setUserType] = useState(null);
  const [userEmail, setUserEmail] = useState('User');
  const navigate = useNavigate();

  // Use the useJwt hook from react-jwt to decode the JWT from localStorage
  const { decodedToken, isExpired } = useJwt(localStorage.getItem('jwtToken'));

  useEffect(() => {
    if (decodedToken && !isExpired) {
      setUserType(decodedToken.type);

      if (decodedToken.type === 'Academic') {
        setUserEmail(decodedToken.profile.academic_email);
      } else if (decodedToken.type === 'Industry') {
        setUserEmail(decodedToken.profile.industry_email);
      }
    }
  }, [decodedToken, isExpired]);

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
    if (academicNameRef.current) {
      const nameWidth = academicNameRef.current.offsetWidth;
      setMenuPosition((nameWidth / 2) + 5);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('jwtToken');
    setUserType(null);
    navigate('/'); // Navigate to the landing page without reloading
  };

  return (
    <header className="header">
      <div className="inner_header">
        <Link to="/" className="logo">
          <img src="/efi_logo_simple.png" alt="Logo" />
        </Link>
        <nav className="nav">
          {userType === null && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
            </>
          )}

          {userType === 'Academic' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/projectSearch" className="nav-link">Project Search</Link>
              <Link to="/savedProject" className="nav-link">Saved Projects</Link>
            </>
          )}
          
          {userType === 'Industry' && (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
              <Link to="/projectSearch" className="nav-link">Project Search</Link>
              <Link to="/projectCreation" className="nav-link">Create Projects</Link>
            </>
          )}

          {userType && (
            <div className="dropdown" onClick={toggleDropdown}>
              <span className="academic-name" ref={academicNameRef}>
                {userEmail} <span className="arrow-down">▼</span>
              </span>
              {dropdownVisible && (
                <div className="dropdown-menu" style={{ left: `calc(50% - ${menuPosition}px)` }}>
                  {userType === 'Academic' && (
                    <>
                      <Link to="/academicProfile" className="dropdown-item">Profile</Link>
                      <Link to="/savedProject" className="dropdown-item">Saved Projects</Link>
                      <Link to="/applications-academic" className="dropdown-item">Applications</Link>
                      <Link to="/recommended-projects" className="dropdown-item">Recommended Projects</Link>
                    </>
                  )}
                  {userType === 'Industry' && (
                    <>
                      <Link to="/industryProfile" className="dropdown-item">Profile</Link>
                      <Link to="/view-applications" className="dropdown-item">View Applications</Link>
                      <Link to="/manage-projects" className="dropdown-item">Manage Projects</Link>
                      <Link to="/create-projects" className="dropdown-item">Create Projects</Link>
                    </>
                  )}
                  <span className="dropdown-item signout" onClick={handleSignOut}>Sign Out</span>
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