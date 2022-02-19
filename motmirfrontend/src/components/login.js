import './styles/login.css';
import { useState } from 'react';
import { baseUrl } from '../index.js';
import { setUserSession } from './common';
import { useNavigate } from 'react-router';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

var Buffer = require('buffer/').Buffer;


function Login(username, password) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const token = Buffer.from(`${e.target.elements.username.value}:${e.target.elements.password.value}`, 'utf8').toString('base64')
    axios.get(baseUrl + '/user/login',{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token}`
      }
    }).then(response => {
      setUserSession(response.data.token);
      navigate('/account', {replace: true});
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401 || error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong. Please try again later.');
      }
    });
    
 
  }

  return (
    <div>

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username</label>
        <input type="text" name="username" required/>

        <label htmlFor="password">Password</label>
        <input type="password" name="password" required/>

        {error && <small className="error">{error}</small>}
        <input type="submit" value={loading ? "Loading" : "Login"} disabled={loading} />
      </form>

    </div>
  )
}

export default Login
