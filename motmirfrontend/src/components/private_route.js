import { Navigate } from 'react-router-dom';
import { getToken } from './common';

function PrivateRoute({children}) {
  return (
    getToken() ? children : <Navigate replace to="/login" />
  )
}

export default PrivateRoute;