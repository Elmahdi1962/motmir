import './styles/admin_panel.css'

import Users from './admin_components/Users';
import UsersDetails from './admin_components/UsersDetails';
import Products from './admin_components/Products';
import Orders from './admin_components/Orders';
import OrdersDetails from './admin_components/OrdersDetails';
import PrivateRoute from './private_route';

import { Route, Routes, NavLink } from 'react-router-dom';


function AdminPanel() {
  return (
    <div>

      <header className="header">
        <nav className="navbar">

            <a href="/admin" className="title">Admin Panel</a>

            <div className="navbarlinkscontainer">
              <div className="navbarlink">
                <NavLink exact={"true"} to="/admin/products" className="pnavlink">
                  <span>Products</span>
                </NavLink>
              </div>

              <div className="navbarlink">
                <NavLink exact={"true"} to="/admin/orders" className="pnavlink">
                  <span>Orders</span>
                </NavLink>
              </div>

              <div className="navbarlink">
                <NavLink exact={"true"} to="/admin/users" className="pnavlink">
                  <span>Users</span>
                </NavLink>
              </div>

              <div className="navbarlink">
                <NavLink exact={"true"} to="/admin/users_details" className="pnavlink">
                  <span>Users Details</span>
                </NavLink>
              </div>

              <div className="navbarlink">
                <NavLink exact={"true"} to="/admin/orders_details" className="pnavlink">
                  <span>Orders Details</span>
                </NavLink>
              </div>
            </div>

        </nav>
      </header>

      <main className="maincontainer">
        <Routes>

          <Route exact={true} path="/products" element={
                                                        <PrivateRoute>
                                                          <Products />
                                                        </PrivateRoute>}
          />

          <Route exact={true} path="/orders" element={
                                                        <PrivateRoute>
                                                          <Orders />
                                                        </PrivateRoute>}
          />

          <Route exact={true} path="/users" element={
                                                        <PrivateRoute>
                                                          <Users />
                                                        </PrivateRoute>}
          />

          <Route exact={true} path="/users_details" element={
                                                        <PrivateRoute>
                                                          <UsersDetails />
                                                        </PrivateRoute>}
          />

          <Route exact={true} path="/orders_details" element={
                                                        <PrivateRoute>
                                                          <OrdersDetails />
                                                        </PrivateRoute>}
          />

        </Routes>
      </main>

    </div>)
}

export default AdminPanel