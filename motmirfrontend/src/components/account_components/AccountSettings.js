import '../styles/AccountSettings.css';
import { useState, useEffect } from 'react';
import { getUser, removeUserSession, secureGetToken } from '../common';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseUrl } from '../..';

function AccountSettings() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAccountDelete = (e) => {
    e.preventDefault();
    const token = secureGetToken();
    if(!user) {
      navigate('/login');
      return;
    }

    axios.delete(baseUrl + "/api/user",
                {
                  headers: {
                    'x-access-token': token
                  }
                })
    .then(response => {
      removeUserSession();
      navigate('/products');
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    });
  }

  useEffect(() => {
    const usr = getUser();
    setUser(usr);
  }, []);

  return (
    <section id="account-settings-container">

      {error ? <p>{error}</p> : <></>}

      <div id="account-user-info">

        <div className="account-user-info-blocks">
          <p><b>Username :</b></p>
          <p>{user ? user.username : 'Login first'}</p>
          <button>Change</button>
        </div>

        <div className="account-user-info-blocks">
          <p><b>Email :</b></p>
          <p>{user ? user.email : 'Login First'}</p>
          <button>Change</button>
        </div>

        <div className="account-user-info-blocks">
          <button id="change-password-btn">Change Password</button>
          <button id="delete-account-btn" onClick={handleAccountDelete}>Delete Account</button>
        </div>

      </div>

    </section>
  )
}

export default AccountSettings