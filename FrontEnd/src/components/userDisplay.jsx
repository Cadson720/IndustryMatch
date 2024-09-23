//import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '/vite.svg'
import '../styles/App.css'
import React, { useState, useEffect } from 'react';

function Appp() {
  const [users, setUsers] = useState([]);  // State to hold the users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    fetch('http://localhost:3000/api/users')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);  // Set fetched data
        setLoading(false);  // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError(error);  // Set error
        setLoading(false);  // Stop loading even if there's an error
      });
  }, []);
  // Empty dependency array ensures this runs once when the component mounts

 // If still loading, show a spinner or loading message
 if (loading) return <p>Loading...</p>;

 // If there's an error, display it
 if (error) return <p>Error: {error.message}</p>;

 // Display the fetched users data
 return (
   <div>
     <h1>User List</h1>
     <ul>
       {users.map(user => (
         <li key={user.id}>{user.username.trim()} ({user.email.trim()}) ({user.phno})</li>
       ))}
     </ul>
   </div>
 );
}

export default Appp;
