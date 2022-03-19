import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { baseUrl } from '..';
import axios from 'axios';

function AccountConfirmation() {
  let { token } = useParams();
  const [error, setError] = useState(null);
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    //send a request to confirm user's account with their token
    axios.get(baseUrl + `/user/confirm_account/${token}`)
    .then((response) => {
      setFlash('Account Confirmed Successfully');
    })
    .catch((error) => {
      if(error.response) {

        const data = error.response.data;
        if(data.status === 'fail'){
          setError(data.data[Object.keys(data.data)[0]]);
          return;
        }else if(data.status === 'error'){
          setError(data.message);
          return;
        }

      }
      setError(error);
    })
  }, []);

  return (
    <div>
      <h1>Account Confirmation</h1>
      {flash ?
        <div>
          <h3>{flash}</h3>
          <h3><a href="/login">LogIn</a></h3>
        </div>
        :
        error ? <h3>{error}</h3> : <></>
      }

    </div>
  )
}

export default AccountConfirmation