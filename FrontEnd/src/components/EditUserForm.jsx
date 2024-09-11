import React, { useState, useEffect } from 'react';

const EditUserForm = ({ userId, onUserUpdated }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phno, setPhno] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch the existing user data and pre-fill the form
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) throw new Error('Failed to fetch user');
        const userData = await response.json();
        setUsername(userData.username);
        setEmail(userData.email);
        setPhno(userData.phno);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedUser = { username, email, phno };

    try {
      const response = await fetch(`http://localhost:3000/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const updated = await response.json();
        console.log('User updated:', updated);
        onUserUpdated(); // Trigger a refresh in the parent component
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (loading) {
    return <div>Loading user data...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
      <button type="submit">Update User</button>
    </form>
  );
};

export default EditUserForm;
