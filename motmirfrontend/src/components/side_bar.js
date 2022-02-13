import './styles/side_bar.css';
import { AiOutlineShop } from 'react-icons/ai'
import { BsCartPlus } from 'react-icons/bs'

const SideBar = ({handleClick}) => {
  const iconStyles = {fontSize: '30px'}
  return (
    <div className="sideBar">

      <h1 className="logo">Motmir</h1>

      <div className="sideBarBtns">
        <a onClick={(event) => handleClick(event)} name="product_list_btn">
          <span>Product List</span>
          <AiOutlineShop className="sideBarIcons"/>
        </a>
      </div>

      <div className="sideBarBtns">
        <a onClick={(event) => handleClick(event)} name="my_cart_btn">
          <span>My Cart</span>
          <BsCartPlus className="sideBarIcons"/>
        </a>
      </div>

    </div>
  );
}

export default SideBar;