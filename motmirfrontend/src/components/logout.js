import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { removeUserSession } from './common.js'

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    removeUserSession();
    navigate('/login', {replace: true});
  });

  return null;
}

export default Logout