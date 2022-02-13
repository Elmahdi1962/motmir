import "./styles/cart_item.css"
import { MdDeleteForever } from 'react-icons/md'
import { useState } from "react";

const CartItem = ({ product, index, cart, setCart }) => {
  const imgAlt = `img of the date ${product.name}`;
  const [totalPrice, setTotalPrice] = useState(product.price * product.quantity);

  const handleQuantityChange = (index, newValue) => {
    const tmp = cart;
    tmp[index]['quantity'] = newValue;
    setCart(tmp);
    setTotalPrice(tmp[index].price * tmp[index].quantity);
  }

  return (
    <div className="cartItem">
      <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt={imgAlt} className="productItemImg" width="30" height="30"/>
      <p>{product.name}</p>
      <p>{product.price} USD/KG</p>
      <input type="number" id="quantity" name="quantity" min="1" max="20" defaultValue={product.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)}/>
      <p>{totalPrice} USD</p>
      <MdDeleteForever/>
    </div>
  )
}

export default CartItem;
