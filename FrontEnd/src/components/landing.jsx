import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';
import Loader from '../components/loader.jsx'; // Import the Loader component
import Header from '../components/header.jsx'; // Import Header
import Footer from '../components/footer.jsx'; // Import Footer
import "../styles/loader.css";
import FeaturedProjects from './featuredProjects';

// Helper function to decode JWT token manually
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]; // Get the payload part of the JWT
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
}

function Landing() {
  const [userType, setUserType] = useState('Invalid');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();
  

  const academicFields = [
    { name: 'role', placeholder: 'Role', options: ['Bachelor', 'Master', 'PhD'], required: true },
    { name: 'school', placeholder: 'School', options: ['UTS', 'UniversityB'], required: true },
  ];

  const industryFields = [
    { name: 'organisation', placeholder: 'Organisation', options: ['OrgA', 'OrgB'], required: true },
    { name: 'discipline', placeholder: 'Discipline', options: ['Engineering', 'Software', 'Medicin'], required: true },
  ];

  const LoginVerify = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    let path;

    try {
      // Try to login with one common API route
      const response = await fetch(`http://localhost:3000/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid credentials');
        }
        throw new Error('Internal server error');
      }

      const { token } = await response.json();  // Backend returns the JWT token

      // Store the JWT token in localStorage
      localStorage.setItem('jwtToken', token);

      // Manually decode the JWT token
      const decodedToken = parseJwt(token);

      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }

      // Set the user type based on the decoded token
      setUserType(decodedToken.type);

      // Determine the next path based on user type
      if (decodedToken.type === 'Academic') {
        path = '/src/html-pages/projectSearch.html';
      } else if (decodedToken.type === 'Industry') {
        path = '/src/html-pages/industryRedirect.html';
      } else if (decodedToken.type === 'Admin') {
        path = '/src/html-pages/adminRedirect.html';
      }

      // Show the loading screen for 1 second before navigating
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate(path);
        window.location.reload();
      }, 1000); // 1-second delay
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);  // Display the error message
    }
  };

  const handleRegisterTypeSelection = (type) => {
    setSelectedUserType(type); // Set the selected user type
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    
    // Handle registration logic here
    try {
      const response = await fetch(`http://localhost:3000/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, userType: selectedUserType })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      alert('Registration successful!');
      setIsRegisterModalOpen(false);
      setSelectedUserType(null); // Reset user type selection
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  if (loading) {
    // Show the loader while loading
    return <Loader />;
  }

  // Show the Header, Footer, and the main content when not loading
  return (
    <>
      <Header />
      <div className='container landing'>
        {/* Login Modal */}
        <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
          <h1>Login</h1>
          <form method="post" onSubmit={LoginVerify}>
            <label>Email</label>
            <input name="email" type="email" placeholder="Email" required />
            <label>Password</label>
            <input name="password" type="password" placeholder="Password" required />
            <div className="login-button">
              <button type="submit">Login</button>
            </div>
          </form>
        </Modal>

        {/* Registration Modal */}
        <Modal isOpen={isRegisterModalOpen} onClose={() => {
          setIsRegisterModalOpen(false);
          setSelectedUserType(null); // Reset the user type when closing
        }}>
          <h1>Register</h1>
          {!selectedUserType ? (
            <div>
              <h3>Select User Type:</h3>
              <button onClick={() => handleRegisterTypeSelection('Academic')}>Academic</button>
              <button onClick={() => handleRegisterTypeSelection('Industry')}>Industry</button>
            </div>
          ) : (
            <form method="post" onSubmit={handleRegisterSubmit}>
              <label>Email</label>
              <input name="email" type="email" placeholder="Email" required />
              <label>Password</label>
              <input name="password" type="password" placeholder="Password" required />
              {/* Render additional fields as dropdown menus based on user type */}
              {selectedUserType === 'Academic' 
                ? academicFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name}>{field.placeholder}:</label>
                      <select name={field.name} required={field.required} id={field.name}>
                        <option value="">Select {field.placeholder}</option> {/* Placeholder option */}
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))
                : industryFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name}>{field.placeholder}:</label>
                      <select name={field.name} required={field.required} id={field.name}>
                        <option value="">Select {field.placeholder}</option> {/* Placeholder option */}
                        {field.options.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                    </div>
                  ))
              }
              <div className="button-container">
                <button type="button" onClick={() => setSelectedUserType(null)}>Back</button>
                <button type="submit">Register as {selectedUserType}</button>
              </div>
            </form>
          )}
        </Modal>

        <div className="diagonal-line"></div> 
        <div className="left-column">
          <div className="text-container">
            <div className="text">Academic to Industry Match</div>
              <button onClick={() => setIsLoginModalOpen(true)} className="auth-button">Login</button>
              <button onClick={() => setIsRegisterModalOpen(true)} className="auth-button">Register</button>
            <p>
            Fostering social and human perspectives in engineering: Projects, Partnerships, Professional Learning.
            With <i className="landing-i">250</i> projects to choose from and over <i className="landing-i">100</i> successful partnerships! Now aided by <strong>AI</strong>.
            </p>
          </div>
        </div>
        <div className="right-column">
          <img src="/landing_image.png" alt="Logo" className="image" />
        </div>
        <div className="seperator"></div> 
      </div>
      <Footer />
    </>
  );
}

export default Landing;
