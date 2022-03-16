import "./styles/cart_item.css"
import { MdDeleteForever } from 'react-icons/md'
import { useState } from "react";
import { imagesUrl } from '../index.js'

const CartItem = ({ product, cart, setCart }) => {
  const imgAlt = `img of the date ${product.name}`;
  const [totalPrice, setTotalPrice] = useState(product.price * product.quantity);

  const handleQuantityChange = (newValue) => {
    if (newValue > 0 && !isNaN(newValue) && newValue <= 20) {
      const new_cart = {...cart};
      new_cart[product.id].quantity = parseInt(newValue);

      // if cart item exists in local storage delete it
      const local_cart = localStorage.getItem("cart");
      if(local_cart) {
        localStorage.removeItem("cart");
      }

      // set the cart item in local storage with new values
      localStorage.setItem("cart", JSON.stringify(new_cart))
      // update cart state
      setCart(new_cart);
      //update total price state
      setTotalPrice(new_cart[product.id].price * new_cart[product.id].quantity);
    }
  }

  const handleDelete = () => {
    let tmp_cart = {...cart};
    let new_cart = {};
    Object.entries(tmp_cart).forEach(([key, prod]) => {
      if(prod.id !== product.id) {
       new_cart[key] = prod;
      }
    });

    // delete the deleted product from local storage and state
    const local_cart = localStorage.getItem("cart");
    if(local_cart) {
      localStorage.removeItem("cart");
      localStorage.setItem("cart", JSON.stringify(new_cart))
      setCart(new_cart);
    } else {
      setCart(new_cart);
    }
  }

  return (
    <div className="cartItem" >
      <img src={imagesUrl +'tr:w-600, h-600/products-images/'+ product.img_name} alt={imgAlt} className="cartItemImg" width="70" height="70"/>
      <p>{product.name}</p>
      <p>{product.price} USD/KG</p>
      <input type="number" id="quantity" name="quantity" min="1" max="20" value={product.quantity} onChange={(e) => handleQuantityChange(e.target.value)} required="required"/>
      <p>{totalPrice} USD</p>
      <MdDeleteForever onClick={handleDelete} className="cart_delete"/>
    </div>
  )
}

export default CartItem;
