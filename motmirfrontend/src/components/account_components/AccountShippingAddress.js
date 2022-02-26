import '../styles/AccountShippingAddress.css';
import { baseUrl } from '../..';
import { secureGetToken } from '../common';
import { useState } from 'react';


function AccountShippingAddress() {
  const [userDetails, setUserDetails] = useState(null);

  const handleUserDetailsSubmit = (e) => {
    e.preventDefault();
  }

  const sendOrder = async (data) => {
    const token = secureGetToken();
    let response = await fetch(baseUrl + '/api/orders',
                {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: {'Content-Type': 'application/json; charset=UTF-8', 'x-access-token': token}
                })
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.blob();
  }

  return (
    <div>

      <div id="account-user-details-container" onClick={(e) => e.stopPropagation()}>

        <form onSubmit={handleUserDetailsSubmit} id="user-details-form">

          <div className="account-sa-form-fields">
            <label htmlFor="full_name"><i className="fa fa-user"></i> Full Name</label>
            <input type="text" id="full_name" name="full_name" placeholder="John M. Doe" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="email"><i className="fa fa-envelope"></i> Email</label>
            <input type="email" id="email" name="email" placeholder="john@example.com" required="required"/>
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
            <label htmlFor="full_address"><i className="fa fa-address-card-o"></i> Address</label>
            <input type="text" id="full_address" name="full_address" placeholder="542 W. 15th Street" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <label htmlFor="zip_code">Zip Code (Code Postal)</label>
            <input type="number" id="zip_code" name="zip_code" placeholder="10001" required="required"/>
          </div>

          <div className="account-sa-form-fields">
            <input type="submit" value={userDetails ? "Update" : "Save"} id="user-details-submit-btn"/>
          </div>

        </form>

        
        {userDetails ?
          <div id="account-user-details"></div>
          : <></>
        }
      
      </div>

    </div>
  );
}

export default AccountShippingAddress