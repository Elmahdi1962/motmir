import "./styles/cart_item.css"
import { MdDeleteForever } from 'react-icons/md'
import { useState } from "react";

const CartItem = ({ product, index, cart, setCart }) => {
  const imgAlt = `img of the date ${product.name}`;
  const [totalPrice, setTotalPrice] = useState(product.price * product.quantity);

  const handleQuantityChange = (index, newValue) => {
    if (newValue > 0 && !isNaN(newValue) && newValue <= 20) {
      const tmp = [...cart];
      tmp[index]['quantity'] = parseInt(newValue);
      setCart(tmp);
      setTotalPrice(tmp[index].price * tmp[index].quantity);
    }
  }

  const handleDelete = () => {
    let tmpcart = cart.filter((prod => prod.id !== product.id));
    setCart(tmpcart);
  }

  return (
    <div className="cartItem">
      <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt={imgAlt} className="productItemImg" width="30" height="30"/>
      <p>{product.name}</p>
      <p>{product.price} USD/KG</p>
      <input type="number" id="quantity" name="quantity" min="1" max="20" value={cart[index].quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} required="required"/>
      <p>{totalPrice} USD</p>
      <MdDeleteForever onClick={handleDelete}/>
    </div>
  )
}

export default CartItem;
