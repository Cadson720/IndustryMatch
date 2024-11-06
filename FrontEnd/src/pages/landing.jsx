import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from './modal';
import Footer from '../pages/footer.jsx';
import "../styles/loader.css";
import "../styles/landing.css";
import FeaturedProjects from './featuredProject';

// Helper function to decode JWT token manually
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
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
  const navigate = useNavigate();
  const [totalProjects, setTotalProjects] = useState(0);

  const academicFields = [
    { name: 'role', placeholder: 'Role', options: ['Bachelor', 'Master', 'PhD'], required: true },
    { name: 'school', placeholder: 'School', options: ['UTS', 'UniversityB'], required: true },
  ];

  const industryFields = [
    { name: 'organisation', placeholder: 'Organisation', options: ['OrgA', 'OrgB'], required: true },
    { name: 'discipline', placeholder: 'Discipline', options: ['Engineering', 'Software', 'Medicine'], required: true },
  ];

  useEffect(() => {
    const fetchTotalProjects = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/project`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        
        const data = await response.json();
        setTotalProjects(data.length);
      } catch (error) {
        console.error('Error fetching total projects:', error);
        setTotalProjects(0);
      }
    };

    fetchTotalProjects();
  }, []);

  const LoginVerify = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    let path;

    try {
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

      const { token } = await response.json();
      localStorage.setItem('jwtToken', token);

      const decodedToken = parseJwt(token);

      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }

      setUserType(decodedToken.type);

      if (decodedToken.type === 'Academic') {
        path = '/projectSearch';
      } else if (decodedToken.type === 'Industry') {
        path = '/industry';
      } else if (decodedToken.type === 'Admin') {
        path = '/adminRedirect';
      }

      navigate(path);
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleRegisterTypeSelection = (type) => {
    setSelectedUserType(type);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");
    
    // Gather additional fields based on user type
    const role = selectedUserType === 'Academic' ? formData.get("role") : null;
    const school = selectedUserType === 'Academic' ? formData.get("school") : null;
    const organisation = selectedUserType === 'Industry' ? formData.get("organisation") : null;
    const discipline = selectedUserType === 'Industry' ? formData.get("discipline") : null;

    try {
      const response = await fetch(`http://localhost:3000/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          userType: selectedUserType,
          role,
          school,
          organisation,
          discipline
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // Automatically log in the user by storing the token from registration response
      const { token } = await response.json();
      localStorage.setItem('jwtToken', token);

      const decodedToken = parseJwt(token);

      if (!decodedToken) {
        throw new Error('Failed to decode token');
      }

      // Navigate based on user type
      if (decodedToken.type === 'Academic') {
        navigate('/projectSearch');
      } else if (decodedToken.type === 'Industry') {
        navigate('/industry');
      } else if (decodedToken.type === 'Admin') {
        navigate('/adminRedirect');
      }

      setIsRegisterModalOpen(false);
      setSelectedUserType(null);

    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  return (
    <>
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
          setSelectedUserType(null);
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
              {selectedUserType === 'Academic' 
                ? academicFields.map((field) => (
                    <div key={field.name}>
                      <label htmlFor={field.name}>{field.placeholder}:</label>
                      <select name={field.name} required={field.required} id={field.name}>
                        <option value="">Select {field.placeholder}</option>
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
                        <option value="">Select {field.placeholder}</option>
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
              <div className="text">Industry Match</div>
              <button onClick={() => setIsLoginModalOpen(true)} className="auth-button">Login</button>
              <button onClick={() => setIsRegisterModalOpen(true)} className="auth-button">Register</button>
              <p>
                Fostering social and human perspectives in engineering: Projects, Partnerships, Professional Learning.
                With <i className="landing-i">{totalProjects}</i> projects to choose from and over <i className="landing-i">25</i> successful partnerships!
              </p>
            </div>
          </div>
          <div className="right-column">
            <img src="/landing_image.png" alt="Logo" className="image" />
          </div>
          <div className="seperator"></div>
      </div>
      <FeaturedProjects />
      <Footer />
    </>
  );
}

export default Landing;
