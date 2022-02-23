import './styles/login.css';
import { useState } from 'react';
import { baseUrl } from '../index.js';
import { setUserSession } from './common';
import { useNavigate } from 'react-router';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaUserAlt } from 'react-icons/fa';
import axios from 'axios';

var Buffer = require('buffer/').Buffer;


function Login(username, password) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const authToken = Buffer.from(`${e.target.elements.username.value}:${e.target.elements.password.value}`, 'utf8').toString('base64');
    axios.get(baseUrl + '/user/login',{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${authToken}`
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
    <div className="login_container">

      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login_form">
        <div className="form_field">
          <label htmlFor="username">Username</label>
          <div className="input_block">
            <FaUserAlt className="login_icon"/>
            <input type="text" name="username" placeholder="Your username" required/>
          </div>
        </div>

        <div className="form_field">
          <label htmlFor="password">Password</label>
          <div className="input_block">
            <RiLockPasswordFill className="login_icon"/>
            <input type="password" name="password" placeholder="Your password" required/>
          </div>
        </div>

        <div className="checkbox_block">
          <input type="checkbox" name="remember" />
          <label htmlFor="remember">Remember me for 30 days</label>
        </div>

        {error && <small className="error">{error}</small>}
        <input className="login_submit" type="submit" value={loading ? "Loading" : "Login"} disabled={loading} />

        <div className="or_block">
          <p>or</p>
          <a href='/register'>Register</a>
        </div>
      </form>

    </div>
  )
}

export default Login
