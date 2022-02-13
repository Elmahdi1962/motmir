import './styles/my_cart.css'
import './styles/cart_item.css'
import CartItem from './cart_item'

const MyCart = ({ cart, setCart}) => {

  return (
    <section className="myCartSection">
      <div className="cartItemsContainer">
        {console.log(cart)}
        <div className="tableHeader">
          <p>Image</p>
          <p>Name</p>
          <p>Price Per KG</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Delete</p>
        </div>
        {cart.map((product, index) => <CartItem product={product} index={index} cart={cart} setCart={setCart} key={index}/>)}
        <div className="tableFooter">
          <p>Total Quantity</p>
          <p>Total Price</p>
          <button>Order Now</button>
        </div>
      </div>
    </section>
  )
}

export default MyCart
