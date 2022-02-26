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
import AdminPanel from './components/admin_panel';
import NotFound from './components/not_found';
import AdminPrivateRoute from './components/admin_private_route';


function App() {
  const [cart, setCart] = useState({});
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {

    // restore client cart if exists
    let local_cart = localStorage.getItem("cart");
    const tmp_cart = JSON.stringify({...cart})
    if(local_cart && local_cart !== tmp_cart) {
      local_cart = JSON.parse(local_cart);
      setCart(local_cart);
    }

    // delete the cart item from local storage if it's empty
    if(local_cart) {
      if(local_cart === '{}' || local_cart === '[]' || local_cart === '' || local_cart.length <= 0) {
        localStorage.removeItem("cart");
      }
    }
    
    const handleStorageEvent = () => {
      // When local storage changes
      window.location.reload();
    }

    window.addEventListener('storage', handleStorageEvent);


    const token = getToken();

    if(!token) {
      return () => {window.removeEventListener('storage', handleStorageEvent);}
    }

    if(jwt_decode(token).exp < Date.now()/1000) {
      removeUserSession();
    }
    setAuthLoading(false);


    return () => {window.removeEventListener('storage', handleStorageEvent);}
  }, [cart]);

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
                                                    <PrivateRoute>
                                                      <SideBar />
                                                      <MyCart cart={cart} setCart={setCart}/>
                                                    </PrivateRoute>}
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
          <Route exact={true} path="/account/*" element={
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

          <Route exact={true} path="/admin/*" element={
                                                    <AdminPrivateRoute>
                                                      <AdminPanel />
                                                    </AdminPrivateRoute>}
          />

          <Route exact={true} path="/" element={<Navigate replace to="/products" />}/>

          <Route exact={true} path="/404" element={<NotFound />}/>

          <Route exact={true} path="/*" element={<NotFound />}/>

        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
