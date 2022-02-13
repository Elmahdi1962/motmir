import './styles/side_bar.css';
import { AiOutlineShop } from 'react-icons/ai'
import { BsCartPlus } from 'react-icons/bs'

const SideBar = ({handleClick}) => {

  return (
    <div className="sideBar">

      <h1 className="logo">Motmir</h1>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="product_list_btn">
          <span>Product List</span>
          <AiOutlineShop className="sideBarIcons"/>
        </button>
      </div>

      <div className="sideBarBtns">
        <button onClick={(event) => handleClick(event)} name="my_cart_btn">
          <span>My Cart</span>
          <BsCartPlus className="sideBarIcons"/>
        </button>
      </div>

    </div>
  );
}

export default SideBar;