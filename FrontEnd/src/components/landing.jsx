import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import Modal from './modal';
import "../styles/landing.css"; // Import the CSS for this component

function Landing() {
  const [userType, setUserType] = useState('Invalid');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [busy, setBusy] = useState(false);
  let navigate = useNavigate();

  const LoginVerify = (e) => {
    e.preventDefault();
    let path = '/';
    const form = e.target;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    //Check if user is an academic
    
    console.log('start academic fetch')
    //console.log(email)
    //console.log(password)
    fetch(`http://localhost:3000/api/academic/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to find academic');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        console.log('start check Academic Users')
        for (let i = 0; i < data.length; i++){
          console.log(data[i].academic_email)
          if(data[i].academic_email == email){
            if(data[i].academic_password == password){
              console.log('User is academic')
              setUserType('Academic')
              break;
            }
          }
        }
        console.log(userType)
        if(userType == 'Academic'){
          //Move to academic page
          path = '/src/html-pages/projectSearch.html';
          navigate(path);
          window.location.reload();
        }
      })
      .catch((error) => console.error('Error finding academic:', error));



    //////check if user is industry
    
    console.log('start industry fetch')
    //console.log(email)
    //console.log(password)
    fetch(`http://localhost:3000/api/industry`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to find industry');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        console.log('start check Industry Users')
        for (let i = 0; i < data.length; i++){
          console.log(data[i].industry_email)
          if(data[i].industry_email == email){
            if(data[i].industry_password == password){
              console.log('User is industry')
              setUserType('Industry')
              break;
            }
          }
        }
        console.log(userType)
        if(userType == 'Industry'){
          //Move to industry page
          path = '/src/html-pages/projectSearch.html';
          navigate(path);
          window.location.reload();
        }
      })
      .catch((error) => console.error('Error finding industry:', error));
  
      
    //////////check if user is admin

    console.log('start admin fetch')
    //console.log(email)
    //console.log(password)
    fetch(`http://localhost:3000/api/admin/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to find admin');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        console.log('start check Admin Users')
        for (let i = 0; i < data.length; i++){
          console.log(data[i].admin_email)
          if(data[i].admin_email == email){
            if(data[i].admin_password == password){
              console.log('User is admin')
              setUserType('Admin')
              break;
            }
          }
        }
        console.log(userType)
        if(userType == 'Admin'){
          //Move to admin page
          path = '/src/html-pages/projectSearch.html';
          navigate(path);
          window.location.reload();
        }
      })
      .catch((error) => console.error('Error finding admin:', error));
/*      

    // Verify which account type logged in
    if (email === 'a@admin.com' && password === 'Admin') {
      setUserType('Admin');
    }

    // Check if user is admin
    if (userType === 'Admin') {
      path = '/src/html-pages/adminRedirect.html';
      navigate(path);
      window.location.reload();
    }

*/

    // User does not exist in the system
    if (userType === 'Invalid') {
      console.log('invalid credentials')
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
