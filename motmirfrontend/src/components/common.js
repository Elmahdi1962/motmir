import jwt_decode from 'jwt-decode';

export const getUser = () => {
  const token = localStorage.getItem("token");
  const user = jwt_decode(token).user;
  if (user) return user;
  else return null;
}

export const getToken = () => {
  // returns token or null if not exist
  return localStorage.getItem("token") || null;
}

export const secureGetToken = () => {
  // returns null when token is expired
  const token = localStorage.getItem("token")
  if(token && jwt_decode(token).exp < Date.now()/1000) {
    removeUserSession();
    return null;
  }
  return token || null;
}

export const setUserSession = (token) => {
  localStorage.setItem("token", token);
}

export const removeUserSession = () => {
  localStorage.removeItem("token");
}
