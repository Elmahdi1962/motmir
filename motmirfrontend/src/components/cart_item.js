import "./styles/cart_item.css"
import { MdDeleteForever } from 'react-icons/md'

const CartItem = ({ product, index, cart, setCart }) => {
  const imgAlt = `img of the date ${product.name}`;

  const handleQuantityChange = (index, newValue) => {
    const tmp = cart;
    tmp[index]['quantity'] = newValue;
    setCart(tmp);
  }

  return (
    <div className="cartItem" key={index}>
      <img src="https://www.toomore.ma/wp-content/uploads/2020/04/Aziza.jpg" alt={imgAlt} className="productItemImg" width="30" height="30"/>
      <p>{product.name}</p>
      <p>{product.price} USD/KG</p>
      <input type="number" id="quantity" name="quantity" min="1" max="20" value={product.qunatity} onChange={(e) => handleQuantityChange(index, e.target.value)}/>
      <p>{cart[index].price * cart[index].price} USD</p>
    </div>
  )
}

export default CartItem;
