import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Credentials.css'

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); 
  const [error, setError] = useState('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/;


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!passwordRegex.test(password)) {
      setError('Password not strong enough.');
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email format.');
      return;
    }
    
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json(); // Get the response data
      if (!response.ok) {
        setError(data.error || 'Signup failed');
        return;
      }

      navigate('/log-in');

    } catch (err) {
      setError(`Signup failed. ${err.message}`);
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!emailRegex.test(text)) {
      setError(`Invalid email format.`);
    } else {
      setError("");
    }
  };

  return (
    <div className="cred-container">
      <div className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
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
          <div className="input-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="auth-button">Sign Up</button>
          {error && <p className="error-message">{error}</p>}
          <p>Already have an account? <Link to="/log-in">Log In</Link></p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
