import './App.css';
import SideBar from './components/side_bar';
import ProductList from './components/product_list';
import MyCart from './components/my_cart';
import { useState } from 'react'

function App() {
  const [pageToShow, setPageToShow] = useState('product list');
  const [cart, setCart] = useState([]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (e.target.name === 'product_list_btn' || e.target.parentNode.name === 'product_list_btn') {
      setPageToShow('product list');
    } else if (e.target.name === 'my_cart_btn' || e.target.parentNode.name === 'my_cart_btn') {
      setPageToShow('my cart')
    }
  }

  return (
    <div className="App">
      <SideBar handleClick={handleClick}/>
      {pageToShow === "product list" ? <ProductList /> :
        pageToShow === "my cart" ? <MyCart cart={cart} setCart={setCart}/>: <>nothing</>}
    </div>
  );
}

export default App;
