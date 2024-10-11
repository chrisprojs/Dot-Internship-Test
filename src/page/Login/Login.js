import { type } from '@testing-library/user-event/dist/type';
import React, { useState } from 'react';
import "./Login.css"
import { LoginData } from './LoginData';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate inputs
    if (username === '' || password === '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Check credentials
    const user = LoginData.find(user => user.username === username && user.password === password);
    
    // If user valid then navigate to quiz and add end-time to local storage, else invalid
    if (user) { 
      localStorage.setItem('username', username);
      localStorage.setItem('end-time', Date.now() + 10 * 60 * 1000);
      navigate('/quiz');
    } else {
      setErrorMessage('Invalid username or password.');
    }
  }

  return (
    <div className='login-container'>
      <form className='login-box' onSubmit={handleSubmit}>
          <h1 className='login-header'>Login</h1>
          {/* input for username */}
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          {/* input for password */}
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {/* if error exist */}
          {errorMessage && <div className="login-error">{errorMessage}</div>}
          {/* login button */}
          <button type="submit" className="login-button">Login</button>
        </form>
    </div>
  )
}

export default Login