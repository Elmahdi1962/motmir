import '../styles/AccountSettings.css';
import { useState, useEffect } from 'react';
import { getUser } from '../common';

function AccountSettings() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const usr = getUser();
    setUser(usr);
  }, []);

  return (
    <section id="account-settings-container">

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
          <button id="delete-account-btn">Delete Account</button>
        </div>

      </div>

    </section>
  )
}

export default AccountSettings