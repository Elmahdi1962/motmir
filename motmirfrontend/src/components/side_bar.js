import './styles/side_bar.css';
import { AiOutlineShop } from 'react-icons/ai';
import { BsCartPlus } from 'react-icons/bs';
import { NavLink } from 'react-router-dom';

const SideBar = ({handleClick}) => {

  return (
    <div className="sideBar">

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
        <NavLink exact={"true"} to="/login" className="navlink">
          <span>Login</span>
          <BsCartPlus className="sideBarIcons"/>
        </NavLink>
      </div>

      <div className="sideBarBtns">
        <NavLink exact={"true"} to="/register" className="navlink">
          <span>Register</span>
          <BsCartPlus className="sideBarIcons"/>
        </NavLink>
      </div>

      <div className="sideBarBtns">
        <NavLink exact={"true"} to="/account" className="navlink">
          <span>Account</span>
          <BsCartPlus className="sideBarIcons"/>
        </NavLink>
      </div>

    </div>
  );
}

export default SideBar;