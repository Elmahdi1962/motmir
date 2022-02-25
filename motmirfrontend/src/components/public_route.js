import { Navigate } from 'react-router-dom';
import { secureGetToken } from './common';

function PublicRoute({ children }) {
  return (
    !secureGetToken() ? children : <Navigate replace to="/account" />
  )
}

export default PublicRoute;