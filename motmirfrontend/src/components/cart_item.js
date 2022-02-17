import "./styles/cart_item.css"
import { MdDeleteForever } from 'react-icons/md'
import { useState } from "react";
import { baseUrl } from '../index.js'

const CartItem = ({ product, cart, setCart }) => {
  const imgAlt = `img of the date ${product.name}`;
  const [totalPrice, setTotalPrice] = useState(product.price * product.quantity);

  const handleQuantityChange = (newValue) => {
    if (newValue > 0 && !isNaN(newValue) && newValue <= 20) {
      const newCart = {...cart};
      newCart[product.id].quantity = parseInt(newValue);
      setCart(newCart);
      setTotalPrice(newCart[product.id].price * newCart[product.id].quantity);
    }
  }

  const handleDelete = () => {
    let newCart = {...cart};
    newCart = Object.values(newCart).filter((prod) => prod.id !== product.id);
    setCart(newCart);
  }

  return (
    <div className="cartItem">
      <img src={baseUrl +'/api/images/'+ product.img_url} alt={imgAlt} className="productItemImg" width="30" height="30"/>
      <p>{product.name}</p>
      <p>{product.price} USD/KG</p>
      <input type="number" id="quantity" name="quantity" min="1" max="20" value={product.quantity} onChange={(e) => handleQuantityChange(e.target.value)} required="required"/>
      <p>{totalPrice} USD</p>
      <MdDeleteForever onClick={handleDelete}/>
    </div>
  )
}

export default CartItem;
