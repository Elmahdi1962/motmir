import './styles/product_list.css';
import { baseUrl } from '../index.js'
import { useEffect, useState } from 'react';
import ProductItem from './product_item.js';

const ProductList = ({ cart, setCart}) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().catch(error => {
      console.log('there was an error when fetching products list : ', error);
    });
  }, []);

  const fetchProducts= async () => {
    let response = await fetch(baseUrl + '/api/products');
    if (!response.ok) {
      // print error
      const error = response.statusText;
      return Promise.reject(error);
    }
    const data = await response.json();
    setProducts(data);
  }

  return (
    <section className="productList">
      <h2>Available Products</h2>

      <div className="productListItemsContainer">
        {products.map((value, index) =>
          <ProductItem product={value} cart={cart} setCart={setCart} key={index}/>
        )}
      </div>

    </section>
  );
}

export default ProductList;