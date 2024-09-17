import React, { useState, useEffect } from 'react';

const UserEdit = () => {
  const [users, setUsers] = useState([]);         // Store users
  const [selectedUser, setSelectedUser] = useState(null);  // Track selected user
  const [formData, setFormData] = useState({      // Form state
    username: '',
    email: '',
    phno: ''
  });

  // Fetch all users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/users');
        const data = await response.json();
        setUsers(data);  // Populate user list
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection from the list
  const handleSelectUser = (user) => {
    setSelectedUser(user.id);  // Set selected user ID
    setFormData({              // Pre-fill form with selected user data
      username: user.username,
      email: user.email,
      phno: user.phno
    });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/api/users/${selectedUser}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),  // Send updated data
      });
  
      if (response.ok) {
        console.log('User updated successfully');
  
        // Clear the form fields by resetting the form data
        setFormData({
          username: '',
          email: '',
          phno: ''
        });
  
        // Optionally, clear the selected user as well
        setSelectedUser(null);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };
  

  return (
    <div>
      <h2>Select a User to Edit</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <button onClick={() => handleSelectUser(user)}>
              {user.username} ({user.email})
            </button>
          </li>
        ))}
      </ul>

      {selectedUser && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            type="text"
            name="phno"
            value={formData.phno}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <button type="submit">Update User</button>
        </form>
      )}
    </div>
  );
};

export default UserEdit;
