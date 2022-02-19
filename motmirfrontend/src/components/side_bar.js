import './styles/side_bar.css';
import { AiOutlineShop } from 'react-icons/ai'
import { BsCartPlus } from 'react-icons/bs'
import { NavLink } from 'react-router-dom';

const SideBar = ({handleClick}) => {

  return (
    <div className="sideBar">

      <h1 className="logo">Motmir</h1>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="product_list_btn">
          <NavLink exact activeClassName="active" to="/products">
            <span>Product List</span>
            <AiOutlineShop className="sideBarIcons"/>
          </NavLink>
        </button>
      </div>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="my_cart_btn">
          <NavLink exact activeClassName="active" to="/mycart">
            <span>My Cart</span>
            <BsCartPlus className="sideBarIcons"/>
          </NavLink>
        </button>
      </div>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="my_cart_btn">
          <NavLink exact activeClassName="active" to="/login">
            <span>Login</span>
            <BsCartPlus className="sideBarIcons"/>
          </NavLink>
        </button>
      </div>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="my_cart_btn">
          <NavLink exact activeClassName="active" to="/register">
            <span>Register</span>
            <BsCartPlus className="sideBarIcons"/>
          </NavLink>
        </button>
      </div>

    </div>
  );
}

export default SideBar;