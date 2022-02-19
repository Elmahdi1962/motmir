import './App.css';
import SideBar from './components/side_bar';
import ProductList from './components/product_list';
import MyCart from './components/my_cart';
import Login from './components/login';
import Register from './components/register';
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  const [pageToShow, setPageToShow] = useState('product list');
  const [cart, setCart] = useState({});

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
      <BrowserRouter>

        <SideBar handleClick={handleClick}/>

        <Routes>
          <Route exact path="/products" render={(props) => <ProductList {...props}  cart={cart} setCart={setCart}/>} />
          <Route exact path="/mycart" render={(props) => <MyCart {...props}  cart={cart} setCart={setCart}/>}  />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Routes>

      </BrowserRouter>
    </div>
  );
}

export default App;
