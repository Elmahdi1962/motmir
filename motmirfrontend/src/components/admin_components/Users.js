import '../styles/users.css';
import { baseUrl } from '../../index.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken } from '../common';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {

    const token = getToken();
    axios.get(baseUrl + "/api/users",{
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-access-token': token
      }
    })
    .then(response => {
      setUsers(response.data);
    })
    .catch(error => {
      console.log(error);
      setError(error.response.data.message);
    });

  }, []);

  return (
      <div className="userscontainer">

        <form className="userform">
          <label htmlFor="username">UserName</label>
          <input type="text" name="username" required="required"/>

          <label htmlFor="email">Email</label>
          <input type="email" name="email" required="required"/>

          <label htmlFor="password">Password</label>
          <input type="text" name="password" required="required"/>

          <label htmlFor="is_admin">Is Admin</label>
          <input type="checkbox" name="is_admin" required="required"/>

          <input type="submit" value="add user" required="required"/>
        </form>

        {error !== '' ? <p>{error}</p> : <></>}

        <div className="useritemscontainer">
          {users.map(user => 
          <div className="useritm" key={user.id}>

            <div className="uinfoblocks">
              <p><b>UserName : </b> {user.username}</p>
            </div>

            <div className="uinfoblocks">
              <p><b>email : </b> {user.email}</p>
            </div>

            <div className="uinfoblocks">
              <p><b>Is Admin : </b> {user.is_admin ? 'Yes' : 'No'}</p>
            </div>

            <div className="uinfoblocks">
              <p><b>Id : </b> {user.id}</p>
            </div>

            <div className="uinfoblocks">
              <p><b>Created_at : </b> {user.created_at}</p>
            </div>

            <div className="uinfoblocks">
              <p><b>Updated_at : </b> {user.updated_at}</p>
            </div>

          </div>
          )}
        </div>
     </div>

  )
}

export default Users;
