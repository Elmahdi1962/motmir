import { Navigate } from 'react-router-dom';
import { baseUrl } from '..';
import { getUser, secureGetToken } from './common';


function AdminPrivateRoute({children}) {

  const isAdmin = () => {
    const token = secureGetToken();
    if(!token) {
      return false;
    }

    const user = getUser()
    if(!user) {
      return false;
    } else if (user.is_admin) {
      return true;
    } else {
      return false;
    }
  }

  return (
    isAdmin() ? children : <Navigate replace to="/404" />
  )
}

export default AdminPrivateRoute;