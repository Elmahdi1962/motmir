import "./styles/account.css";
import AccountOrders from "./account_components/AccountOrders";
import PrivateRoute from './private_route';
import { Routes, Route, NavLink } from 'react-router-dom';
import { getUser } from './common';


function Account(props) {
  const user = getUser();

  return (
    <section className="account_container">

      <div className="account_header">
        <div className="account_greeting">
          <h1>Hi {user.username}</h1>
        </div>
        <nav className="account_navabar">
          <NavLink exact={"true"} to="orders" className="account_navlink">Orders</NavLink>
          <NavLink exact={"true"} to="shipping_address" className="account_navlink">Shipping Address</NavLink>
          <NavLink exact={"true"} to="settings" className="account_navlink">Settings</NavLink>
        </nav>
      </div>

      <Routes>
        <Route exact={true} path="/orders" element={
                                                      <PrivateRoute>
                                                        <AccountOrders />
                                                      </PrivateRoute>}
        />

        <Route exact={true} path="/shipping_address" element={
                                                      <PrivateRoute>
                                                        <Account />
                                                      </PrivateRoute>}
        />

        <Route exact={true} path="/settings" element={
                                                      <PrivateRoute>
                                                        <Account />
                                                      </PrivateRoute>}
        />
      </Routes>

    </section>
  )
}

export default Account