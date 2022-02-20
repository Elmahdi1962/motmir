import { useNavigate } from 'react-router-dom';
import { getUser, removeUserSession } from './common';


function Account(props) {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    removeUserSession();
    navigate('/')
  }
  return (
    <div>
      <h2>Hi {user.username}</h2>
      <br/>
      <input type="button" value="Logout" onClick={handleLogout}/>
    </div>
  )
}

export default Account