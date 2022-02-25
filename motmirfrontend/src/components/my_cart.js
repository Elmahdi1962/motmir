import './styles/my_cart.css'
import CartItem from './cart_item'
import { useEffect, useState } from 'react';
import OrderForm from './order_form';
import { secureGetToken } from './common';

const MyCart = ({ cart, setCart}) => {
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showOrderForm, setShowOrderForm] = useState(false);

  useEffect(() => {
    let tp = 0;
    let tq = 0;
    for(const product of Object.values(cart)) {
      tp += (product.price * product.quantity);
      tq += product.quantity;
    }
    setTotalPrice(tp);
    setTotalQuantity(tq);
  }, [cart]);

  return (
    <section className="myCartSection">
      <h2>My Cart</h2>
      <div className="cartItemsContainer">
        <div className="tableHeader">
          <p><b>Image</b></p>
          <p><b>Name</b></p>
          <p><b>Price Per KG</b></p>
          <p><b>Quantity</b></p>
          <p><b>Total</b></p>
          <p><b>Delete</b></p>
        </div>
        {Object.entries(cart).map(([productId, product]) => <CartItem product={product} cart={cart} setCart={setCart} key={productId}/>)}
        <div className="tableFooter">
          <p><b>Total Quantity:</b> {totalQuantity} Kg</p>
          <p><b>Total Price</b> {totalPrice} USD</p>
          <button onClick={() => setShowOrderForm(true)}>Order Now</button>
        </div>
      </div>
      {showOrderForm && totalQuantity && secureGetToken() ? <OrderForm setShowOrderForm={setShowOrderForm} cart={cart} setCart={setCart} totalQuantity={totalQuantity} totalPrice={totalPrice}/> : <></>}
    </section>
  )
}

export default MyCart
