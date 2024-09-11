import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Credentials.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      const { token } = await response.json();
      localStorage.setItem('userId', token);
      // Redirect to the profile page on successful login
      navigate('/profile');
    } catch (err) {
      setError('Login failed.');
    }
  };

  return (
    <div className='cred-container'>
        <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
            <h2>Login</h2>
            <div className="input-group">
            <label>Username</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            </div>
            <div className="input-group">
            <label>Password</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit" className="auth-button">Login</button>
            {error && <p className="error-message">{error}</p>}
            <p>Don't have an account? <Link to="/sign-up">Sign Up</Link></p>
        </form>
        </div>
    </div>
  );
};

export default Login;
