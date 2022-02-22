import './styles/register.css';
import { useState } from 'react';
import axios from 'axios';
import { baseUrl } from '..';
import { useNavigate } from 'react-router';

function Register() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    if(e.target.elements.password.value !== e.target.elements.confirm_password.value) {
      setLoading(false);
      setError('Passwords do not match!');
      return;
    }

    const data = {
      "username": e.target.elements.username.value,
      "email": e.target.elements.email.value,
      "password": e.target.elements.password.value
    };

    axios.post(baseUrl + '/user/register', data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      setLoading(false);
      navigate('/login');
    }).catch(error => {
      setLoading(false);
      if(error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Failed to Register. Please try again later.');
      }
    });
  }

  return (
    <div className="register_container">

    <h2>Register</h2>
    <form onSubmit={handleRegister} className="register_form">
      
      <div className="form_field">
        <label htmlFor="username">Username</label>
        <div className="input_block">
          <input placeholder="username" type="text" name="username" maxLength="29" minLength="4" required/>
        </div>
      </div>
      
      <div className="form_field">
        <label htmlFor="email">Email</label>
        <div className="input_block">
          <input placeholder="email" type="email" name="email" maxLength="59" required/>
        </div>
      </div>
      
      <div className="form_field">
        <label htmlFor="password">Password</label>
        <div className="input_block">
          <input placeholder="password" type="password" name="password" maxLength="29" minLength="8" required/>
        </div>
      </div>
      
      <div className="form_field">
        <label htmlFor="confirm_password">Confirm Password</label>
        <div className="input_block">
          <input placeholder="confirm password" type="password" name="confirm_password" maxLength="29" minLength="8" required/>
        </div>
      </div>
      {error && <small className="error">{error}</small>}
      <input className="register_submit" type="submit" value={loading ? "Loading" : "Register"} disabled={loading} />

      <div className="or_block">
          <p>or</p>
          <a href='/login'>Login</a>
        </div>
    </form>

  </div>
  )
}

export default Register