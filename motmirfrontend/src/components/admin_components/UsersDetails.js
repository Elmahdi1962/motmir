import '../styles/UsersDetails.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { secureGetToken } from '../common';
import axios from 'axios';
import { baseUrl } from '../..';

function UsersDetails() {
  const [usersDetails, setUsersDetails] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {

    const token = secureGetToken();

    if(!token) {
      navigate('/login');
      return;
    }

    axios.get(baseUrl + "/api/users_details", {
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      if(response.data.length <= 0) {
        setError("There is no orders.");
      }
      setUsersDetails(response.data);
    })
    .catch(error => {
      if(error.response) {
        setError(error.response.data.message);
      } else {
        setError("Something wrong happened!");
      }
    });

  }, [navigate]);

  return (
      <div className="admin-users-details-container">

        {error ? <p>{error}</p> : <></>}

        {usersDetails.map(userDetail => 
          <div className="admin-users-details-item" key={userDetail.id}>
            <p className="admin-users-details-item-text"><strong>Id : </strong>{userDetail.id}</p>
            <p className="admin-users-details-item-text"><strong>Full Name : </strong>{userDetail.full_name}</p>
            <p className="admin-users-details-item-text"><strong>Country : </strong>{userDetail.country}</p>
            <p className="admin-users-details-item-text"><strong>City : </strong>{userDetail.city}</p>
            <p className="admin-users-details-item-text"><strong>Zip Code : </strong>{userDetail.zip_code}</p>
            <p className="admin-users-details-item-text"><strong>State : </strong>{userDetail.state}</p>
            <p className="admin-users-details-item-text"><strong>Full Address : </strong>{userDetail.full_address}</p>
            <p className="admin-users-details-item-text"><strong>Phone Number : </strong>{userDetail.phone_number}</p>
            <p className="admin-users-details-item-text"><strong>User Id : </strong>{userDetail.user_id}</p>
          </div>
        )}

      </div>
  )
}

export default UsersDetails