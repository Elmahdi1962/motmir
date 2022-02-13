import './styles/my_cart.css'
import CartItem from './cart_item'

const MyCart = ({ cart, setCart}) => {

  return (
    <section className="myCartSection">
      <div className="cartItemsContainer">
        {cart.map((product, index) => <CartItem product={product} index={index} cart={cart} setCart={setCart}/>)}
      </div>
    </section>
  )
}

export default MyCart
