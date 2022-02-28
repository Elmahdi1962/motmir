import '../styles/AccountShippingAddress.css';
import axios from 'axios';
import { baseUrl } from '../..';
import { secureGetToken } from '../common';
import { useState, useEffect } from 'react';


function AccountShippingAddress() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
    getDetails();
  }, []);

  const getDetails = async () => {
    // get user details
    const token = secureGetToken();
    await axios.get(baseUrl + '/api/user/user_details',
                {
                  headers: {'Content-Type': 'application/json; charset=UTF-8', 'x-access-token': token}
                })
                .then(response => {
                  setUserDetails(response.data.data);
                })
                .catch(error => {
                  setError('getting Failed');
                });
  }

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
    const elements = e.target.elements;
    const data = {};
    for (const elem of elements) {
      if (elem.name !== "") {
        data[elem.name] = elem.value;
      }
    };
    setError(null);
    setLoading(true);
    sendDetails(data);
    setLoading(false);
  }

  const sendDetails = async (data) => {
    // sends user details to add or update
    const token = secureGetToken();
    await axios.post(baseUrl + '/api/user/user_details', JSON.stringify(data),
                {
                  headers: {'Content-Type': 'application/json; charset=UTF-8', 'x-access-token': token}
                })
                .then(response => {
                  setUserDetails(response.data.data);
                })
                .catch(error => {
                  setError('Process Failed');
                });
  }

  return (
    <div>

      {error ? <div>{error}</div> : <></>}

      <div id="account-user-details-container" onClick={(e) => e.stopPropagation()}>

        <form onSubmit={handleUserDetailsSubmit} id="user-details-form">

          <div className="account-sa-form-fields">
            <label htmlFor="full_name"><i className="fa fa-user"></i> Full Name</label>
            <input type="text" id="full_name" name="full_name" placeholder="John M. Doe" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="phone_number"><i className="fa fa-phone"></i> Phone Number</label>
            <input type="text" id="phone_number" name="phone_number" placeholder="+212611223344" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="country"><i className="fa fa-flag"></i> Country</label>
            <input type="text" id="country" name="country" placeholder="United states of America" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="state">State</label>
            <input type="text" id="state" name="state" placeholder="NY" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="city"><i className="fa fa-institution"></i> City</label>
            <input type="text" id="city" name="city" placeholder="New York" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="full_address"><i className="fa fa-address-card-o"></i>Full Address</label>
            <input type="text" id="full_address" name="full_address" placeholder="542 W. 15th Street" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="zip_code">Zip Code (Code Postal)</label>
            <input type="number" id="zip_code" name="zip_code" placeholder="10001" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <input type="submit" value={userDetails ? "Update" : "Save"} id="user-details-submit-btn" disabled={loading}/>
          </div>

        </form>
 
        {userDetails ?
          <div id="account-user-details">
            <p><b>Full Name : </b> {userDetails.full_name}</p>
            <p><b>Phone Number : </b> {userDetails.phone_number}</p>
            <p><b>Country : </b> {userDetails.country}</p>
            <p><b>State : </b> {userDetails.state}</p>
            <p><b>City : </b> {userDetails.city}</p>
            <p><b>Full Address : </b> {userDetails.full_address}</p>
            <p><b>Zip Code : </b> {userDetails.zip_code}</p>
          </div>
          : <></>
        }
      
      </div>

    </div>
  );
}

export default AccountShippingAddress