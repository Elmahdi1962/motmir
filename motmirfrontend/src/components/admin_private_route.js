import { Navigate } from 'react-router-dom';
import { baseUrl } from '..';
import { secureGetToken } from './common';
import axios from 'axios';

function AdminPrivateRoute({children}) {

  const isAdmin = () => {
    let token = secureGetToken();
    if(!token) {
      return false;
    }

    axios.get(baseUrl + "/user/is_admin",{
      headers: {
        'x-access-token': token
      }
    })
    .then(response => {
      if(response.data.is_admin) {
        return true;
      } else {
        return false;
      }
    })
    .catch(error => {
      return false;
    })
  }
  isAdmin()
  return (
    isAdmin() ? children : <Navigate replace to="/404" />
  )
}

export default AdminPrivateRoute;