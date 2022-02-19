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
      if(error.response.status === 400 || error.response.status === 401) {
        setError(error.data.message);
      } else {
        setError('Failed to Register. Please try again later.');
      }
    });
  }

  return (
    <div>

    <h2>Register</h2>
    <form onSubmit={handleRegister}>
      <label htmlFor="username">Username</label>
      <input type="text" name="username" maxLength="29" minLength="4" required/>

      <label htmlFor="email">Email</label>
      <input type="email" name="email" maxLength="59" required/>

      <label htmlFor="password">Password</label>
      <input type="password" name="password" maxLength="29" minLength="8" required/>

      <label htmlFor="confirm_password">Confirm Password</label>
      <input type="password" name="confirm_password" maxLength="29" minLength="8" required/>

      {error && <small className="error">{error}</small>}
      <input type="submit" value={loading ? "Loading" : "Register"} disabled={loading} />
    </form>

  </div>
  )
}

export default Register