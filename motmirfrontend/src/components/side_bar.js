import './styles/side_bar.css';
import { AiOutlineShop, AiOutlineUserAdd } from 'react-icons/ai';
import { BsCartPlus } from 'react-icons/bs';
import { RiLoginBoxLine, RiLogoutBoxLine } from 'react-icons/ri';
import { MdAccountBox } from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import { getToken } from './common';
import { useState } from 'react'


const SideBar = () => {
  const [toggle, setToggle] = useState(true);
  let token = getToken();

  const handleSideBarToggle = (e) => {
    if(toggle) {
      document.getElementById("menu_toggle").innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.getElementById("logo_text").style.display = "none";
      document.getElementById("sideBar").style.width = '60px';
      let all = document.getElementsByTagName("span");
      Array.prototype.forEach.call(all, (elm) => {elm.style.display = "none";})
      all = document.getElementsByClassName("sideBarIcons");
      Array.prototype.forEach.call(all, (elm) => {elm.style.margin = "auto";})
      setToggle(false);
    } else {
      document.getElementById("menu_toggle").innerHTML = '<i class="fa-solid fa-xmark"></i>';
      document.getElementById("logo_text").style.display = "block";
      document.getElementById("sideBar").style.width = '220px';
      let all = document.getElementsByTagName("span");
      Array.prototype.forEach.call(all, (elm) => {elm.style.display = "block";})
      all = document.getElementsByClassName("sideBarIcons");
      Array.prototype.forEach.call(all, (elm) => {elm.style.margin = "0";})
      setToggle(true);
    }
  }

  return (
    <div id="sideBar">
      <button id="menu_toggle" onClick={(e) => handleSideBarToggle()} ><i className="fa-solid fa-xmark"></i></button>

      <div className="nav_buttons">
        <div className="logo">
          <i className="fa-solid fa-seedling"></i>
          <h1 id="logo_text" >Motmir</h1>
        </div>

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