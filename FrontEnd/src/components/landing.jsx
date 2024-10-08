import React, { useState, useEffect } from 'react';
import {Routes, Route} from 'react-router-dom';
import { Navigate, useNavigate } from 'react-router-dom';
import "../styles/landing.css"; // Import the CSS for this component

function Landing(){
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

  let navigate = useNavigate()

  const [userType, setUserType] = useState('Invalid')

  const LoginVerify = (e) =>{
    e.preventDefault()
    let path = '/'
    const form = e.target
    const formData = new FormData(form)
    const email = formData.get("email")
    const password = formData.get("password")
    //alert(email)
    //alert(password)
    //verify which account type logged in
    if (email === 'a@admin.com' && password === 'Admin'){
      setUserType('Admin')
    }
    if (email === 'i@industry.com' && password === 'Industry'){
      setUserType('Industry')
    }

    //check if user is admin
    if (userType == 'Admin'){
      path = '/src/html-pages/adminRedirect.html'
      navigate(path)
      window.location.reload()
    }
    //check if user is industry
    if (userType == 'Industry'){
      path = '/src/html-pages/industryRedirect.html'
      navigate(path)
      window.location.reload()
    }
   
    //user does not exist in system
    if (userType == 'Invalid'){
      alert('invalid email and/or password')
    }
  }

  return (

    

    <div className='container'>
      <div className="text">Login</div>
      <form method="post" onSubmit={LoginVerify}>
        <input name ="email" type="email" placeholder="email"/>
        <input name = "password" type="password" placeholder="password"/>
        <button type="submit">Login Button</button>
      </form>
      
      
    </div>

    
  
  )

}



export default Landing;

