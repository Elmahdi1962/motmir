import jwt_decode from 'jwt-decode';

export const getUser = () => {
  const token = localStorage.getItem("token");
  const user = jwt_decode(token).user;
  if (user) return user;
  else return null;
}

export const getToken = () => {
  return localStorage.getItem("token") || null;
}

export const setUserSession = (token) => {
  localStorage.setItem("token", token);
}

export const removeUserSession = () => {
  localStorage.removeItem("token");
}
