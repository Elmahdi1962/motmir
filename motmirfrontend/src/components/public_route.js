import { Route, Navigate } from 'react-router-dom';
import { getToken } from './common';

function PublicRoute({ children }) {
  return (
    !getToken() ? children : <Navigate replace to="/account" />
  )
}

export default PublicRoute;