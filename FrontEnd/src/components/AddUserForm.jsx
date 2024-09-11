import React, { useState } from 'react';

const AddUserForm = ({ refreshUsers }) => { // Add refreshUsers as a prop
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phno, setPhno] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newUser = { username, email, phno };

    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const addedUser = await response.json();
        console.log('User added:', addedUser);

        // Clear the form fields after successful submission
        setUsername(''); 
        setEmail('');
        setPhno('');

        // --- Call the refreshUsers function after adding a new user ---
        refreshUsers();
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="text"
        value={phno}
        onChange={(e) => setPhno(e.target.value)}
        placeholder="Phone Number"
        required
      />
      <button type="submit">Add User</button>
    </form>
  );
};

export default AddUserForm;
