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
import { getToken, removeUserSession, setUserSession } from './components/common';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { baseUrl } from './index.js';

function App() {
  const [cart, setCart] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = getToken();

    if(!token) return;
    console.log("exp ==>", jwt_decode(token).exp, "|| Date Now ==>", Date.now());
    if(jwt_decode(token).exp < Date.now()) {
      removeUserSession();
      setAuthLoading(false);
    }

  });

  if (authLoading && getToken()) {
    return <div>Checking Authentication...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>

        <SideBar />

        <Routes>
          <Route exact={true} path="/products" element={<ProductList cart={cart} setCart={setCart}/>} />
          <Route exact={true} path="/mycart" element={<MyCart cart={cart} setCart={setCart}/>} />
          <Route exact={true} path="/register" element={
                                                    <PublicRoute>
                                                      <Register />
                                                    </PublicRoute>}
          />
          <Route exact={true} path="/login" element={
                                                    <PublicRoute>
                                                      <Login />
                                                    </PublicRoute>}
          />
          <Route exact={true} path="/account" element={
                                                    <PrivateRoute>
                                                      <Account />
                                                    </PrivateRoute>}
          />
          <Route exact={true} path="/" element={<Navigate replace to="/login" />}/>
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
