import '../styles/users.css';
import { baseUrl } from '../../index.js';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { getToken, secureGetToken } from '../common';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUserAdding = (e) => {
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
      "password": e.target.elements.password.value,
      "is_admin": e.target.elements.is_admin.checked
    };

    axios.post(baseUrl + '/user/register', data, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    }).then(response => {
      setLoading(false);
      window.location.reload();
    }).catch(error => {
      setLoading(false);
      if(error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Failed to Register. Please try again later.');
      }
    });
  }


  const handleUserDelete = (e) => {
    e.preventDefault();
    const token = secureGetToken();
    if(!token) {
      navigate('/login');
      return;
    }

    axios.delete(baseUrl + '/api/user/delete/' + e.target.getAttribute('data-userid'),
                {
                  headers: {
                    'x-access-token': token
                  }
                })
    .then(response => {
      window.location.reload();
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError('Something went wrong.');
      }
    })
  }


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
      if(error.response.status === 401) {
        navigate('/login')
      } else if(error.response.data) {
        setError(error.response.data.message);
      } else {
        setError('Failed to Register. Please try again later.');
      }
    });

  }, []);

  return (
      <div className="userscontainer">

        <form className="userform" onSubmit={handleUserAdding}>
          <label htmlFor="username">UserName</label>
          <input placeholder="username" type="text" name="username" required="required"/>

          <label htmlFor="email">Email</label>
          <input placeholder="email" type="email" name="email" required="required"/>

          <label htmlFor="password">Password</label>
          <input placeholder="password" type="password" name="password" required="required" maxLength="30" minLength="8"/>

          <label htmlFor="confirm_password">Confirm Password</label>
          <input placeholder="confirm password" type="password" name="confirm_password" maxLength="30" minLength="8" required="required"/>

          <label htmlFor="is_admin">Is Admin</label>
          <input type="checkbox" name="is_admin"/>

          <input type="submit" value="add user" disabled={loading}/>
        </form>

        {error !== '' ? <p>{error}</p> : <></>}

        <div className="useritemscontainer">
          {users.map(user => 
          <div className="useritm" key={user.id}>

            <div className="userdropdown">
              <button className="userdropbtn"><i className="fa-solid fa-caret-down"></i></button>
              <div className="userdropdown-content">
                <button data-userid={user.id} onClick={handleUserDelete}>Delete</button>
              </div>
            </div>

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
