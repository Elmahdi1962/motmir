import './styles/side_bar.css';
import { AiOutlineShop, AiOutlineUserAdd } from 'react-icons/ai';
import { BsCartPlus } from 'react-icons/bs';
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri';
import { MdAccountBox } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { getToken } from './common';


const SideBar = () => {
  let token = getToken();

  return (
    <div className="sideBar">

      <div className="nav_buttons">
        <h1 className="logo">Motmir</h1>

        <div className="sideBarBtns">
          <NavLink exact={"true"} to="/products" className="navlink">
            <span>Product List</span>
            <AiOutlineShop className="sideBarIcons"/>
          </NavLink>
        </div>

        <div className="sideBarBtns">
          <NavLink exact={"true"} to="/mycart" className="navlink">
            <span>My Cart</span>
            <BsCartPlus className="sideBarIcons"/>
          </NavLink>
        </div>

        <div className="sideBarBtns">
          <NavLink exact={"true"} to="/account" className="navlink">
            <span>Account</span>
            <MdAccountBox className="sideBarIcons"/>
          </NavLink>
        </div>
      </div>

      <div className="auth_buttons">
        {token ? 
        <div className="sideBarBtns">
          <NavLink exact={"true"} to="/logout" className="navlink">
            <span>Logout</span>
            <RiLogoutBoxLine className="sideBarIcons"/>
          </NavLink>
        </div>
        :
        <>
          <div className="sideBarBtns">
            <NavLink exact={"true"} to="/login" className="navlink">
              <span>Login</span>
              <RiLoginBoxLine className="sideBarIcons"/>
            </NavLink>
          </div>

          <div className="sideBarBtns">
            <NavLink exact={"true"} to="/register" className="navlink">
              <span>Register</span>
              <AiOutlineUserAdd className="sideBarIcons"/>
            </NavLink>
          </div>
        </>
        }
      </div>

    </div>
  );
}

export default SideBar;