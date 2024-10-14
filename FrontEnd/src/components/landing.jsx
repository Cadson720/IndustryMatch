import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Modal from './modal';
import "../styles/landing.css"; // Import the CSS for this component

/*
  const [academics, setAcademic] = useState([]);
  const [industries, setIndustry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //Fetch both academics and industries from the backend when the component mounts
  useEffect(() => {
    //academic fetch
    fetch('http://localhost:3000/api/academic')
      .then((response) => {
        if (!response.ok) {
        throw new Error('Failed to fetch academic data');
        }
        return response.json();
      })
      .then((data) => {
          setAcademic(data);
      })
    //industry fetch
    fetch('http://localhost:3000/api/industry')
    .then((response) => {
      if (!response.ok) {
      throw new Error('Failed to fetch industry data');
      }
      return response.json();
    })
    .then((data) => {
        setIndustry(data);
        setLoading(false);
    })
  }, []);
  */


function Landing() {
  const [userType, setUserType] = useState('Invalid');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  let navigate = useNavigate();

  const LoginVerify = (e) => {
    e.preventDefault();
    let path = '/';
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    // Verify which account type logged in
    if (email === 'a@admin.com' && password === 'Admin') {
      setUserType('Admin');
    }
    if (email === 'i@industry.com' && password === 'Industry') {
      setUserType('Industry');
    }
    if (email === 'd@academic.com' && password === 'Academic') {
      setUserType('Academic');
    }

    // Check if user is admin
    if (userType === 'Admin') {
      path = '/src/html-pages/adminRedirect.html';
      navigate(path);
      window.location.reload();
    }
    // Check if user is industry
    if (userType === 'Industry') {
      path = '/src/html-pages/projectCreation.html';
      navigate(path);
      window.location.reload();
    }

    // Check if user is academic
    if (userType === 'Academic') {
      path = '/src/html-pages/projectSearch.html';
      navigate(path);
      window.location.reload();
    }

    // User does not exist in the system
    if (userType === 'Invalid') {
      alert('Invalid email and/or password');
    }
  };

  const handleRegisterTypeSelection = (type) => {
    setSelectedUserType(type);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    // Collect additional field values dynamically
    const extraFields = {};
    const fields = selectedUserType === 'Academic' 
      ? academicFields 
      : industryFields;

    fields.forEach(field => {
      extraFields[field.name] = formData.get(field.name);
    });

    // Handle registration logic based on selected user type
    console.log(`Registering ${selectedUserType}:`, email, password, extraFields);
    // Here you can add registration logic (e.g., send data to backend)

    // Close the registration modal after submission
    setIsRegisterModalOpen(false);
    alert('Registration successful!');
  };

  // Define input fields for Academic and Industry
const academicFields = [
  { name: 'university', placeholder: 'University', required: true, options: ['University A', 'University B', 'University C'] },
  { name: 'role', placeholder: 'Role', required: true, options: ['Subject Coordinator', 'Researcher', 'Professor'] }
];

const industryFields = [
  { name: 'discipline', placeholder: 'Discipline', required: true, options: ['Discipline A', 'Discipline B', 'Discipline C'] },
  { name: 'organisation', placeholder: 'Organisation', required: true, options: ['Org A', 'Org B', 'Org C'] }
];


  return (
    <div className='container landing'>
            {/* Login Modal */}
            <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)}>
        <h1>Login</h1>
        <form method="post" onSubmit={LoginVerify}>
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" required />
          <label>Passsord</label>
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
  );
}

export default Landing;
