import { Navigate } from 'react-router-dom';
import { secureGetToken } from './common';

function PrivateRoute({children}) {
  return (
    secureGetToken() ? children : <Navigate replace to="/login" />
  )
}

export default PrivateRoute;