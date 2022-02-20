import './App.css';
import SideBar from './components/side_bar';
import ProductList from './components/product_list';
import MyCart from './components/my_cart';
import Login from './components/login';
import Register from './components/register';
import Account from './components/account';
import PublicRoute from './components/public_route';
import PrivateRoute from './components/private_route';
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { getToken, removeUserSession } from './components/common';
import jwt_decode from 'jwt-decode';
import Logout from './components/logout';


function App() {
  const [cart, setCart] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleStorageEvent = () => {
      // When local storage changes
      window.location.reload();
    }

    window.addEventListener('storage', handleStorageEvent);

    const token = getToken();

    if(!token) {return () => {window.removeEventListener('storage', handleStorageEvent);}}

    if(jwt_decode(token).exp < Date.now()/1000) {
      removeUserSession();
    }
    setAuthLoading(false);


    return () => {window.removeEventListener('storage', handleStorageEvent);}
  }, []);

  if (authLoading && getToken()) {
    return <div>Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>

        <Routes>
          <Route exact={true} path="/products" element={
                                                    <>
                                                      <SideBar />
                                                      <ProductList cart={cart} setCart={setCart}/>
                                                    </>}
          />
          <Route exact={true} path="/mycart" element={
                                                    <>
                                                      <SideBar />
                                                      <MyCart cart={cart} setCart={setCart}/>
                                                    </>}
          />
          <Route exact={true} path="/register" element={
                                                    <PublicRoute>
                                                      <SideBar />
                                                      <Register />
                                                    </PublicRoute>}
          />
          <Route exact={true} path="/login" element={
                                                    <PublicRoute>
                                                      <SideBar />
                                                      <Login />
                                                    </PublicRoute>}
          />
          <Route exact={true} path="/account" element={
                                                    <PrivateRoute>
                                                      <SideBar />
                                                      <Account />
                                                    </PrivateRoute>}
          />

          <Route exact={true} path="/logout" element={
                                                    <PrivateRoute>
                                                      <Logout />
                                                    </PrivateRoute>}
          />
          <Route exact={true} path="/" element={<Navigate replace to="/login" />}/>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
