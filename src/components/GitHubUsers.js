import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GitHubUsers.css';

const GitHubUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://api.github.com/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching users: ' + err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
      </div>
    );
  }

  return (
    <div className="users-grid">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <img src={user.avatar_url} alt={`${user.login}'s avatar`} className="user-avatar" />
          <h3 className="user-login">{user.login}</h3>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="user-link"
          >
            View Profile
          </a>
        </div>
      ))}
    </div>
  );
};

export default GitHubUsers; 